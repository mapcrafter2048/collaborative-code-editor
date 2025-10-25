const { spawn } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

/**
 * DockerExecutionService handles secure code execution in isolated Docker containers
 * Features:
 * - Multi-language support (3 languages: Python, JavaScript, TypeScript)
 * - Resource constraints and timeouts
 * - Secure container isolation
 * - Temporary file management
 * - Error handling and logging
 */
class DockerExecutionService {
  constructor() {
    this.supportedLanguages = {
      python: {
        image: "python-runner:latest",
        extension: ".py",
        command:
          "timeout 10s python code.py < input.txt 2>&1 || timeout 10s python code.py 2>&1",
        requiresCompilation: false,
      },
      javascript: {
        image: "node-runner:latest",
        extension: ".js",
        command:
          "timeout 10s node code.js < input.txt 2>&1 || timeout 10s node code.js 2>&1",
        requiresCompilation: false,
      },
      typescript: {
        image: "typescript-runner:latest",
        extension: ".ts",
        command:
          "timeout 300s tsx --tsconfig tsconfig.json code.ts < input.txt 2>&1 || timeout 300s tsx --tsconfig tsconfig.json code.ts 2>&1",
        requiresCompilation: false,
        timeout: 300000,
        setupFiles: {
          "tsconfig.json": {
            compilerOptions: {
              target: "ES2020",
              module: "commonjs",
              moduleResolution: "node",
              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
              sourceMap: false,
              outDir: ".tsx-cache",
            },
          },
          "package.json": {
            type: "commonjs",
          },
        },
      },
    };

    this.defaultTimeout = 10000; // 10 seconds
    this.maxMemory = "256m";
    this.maxCpus = "1.0";

    console.log("🐳 DockerExecutionService initialized");
    this.checkDockerAvailability();
  }

  /**
   * Check if Docker is available on the system
   */
  async checkDockerAvailability() {
    try {
      await this.runCommand("docker", ["--version"]);
      console.log("✅ Docker is available");
    } catch (error) {
      console.error("❌ Docker is not available:", error.message);
      console.error("🔧 Please ensure Docker is installed and running");
    }
  }

  /**
   * Execute code in a Docker container
   */
  async executeCode(code, language, roomId, timeout) {
    const startTime = Date.now();
    let tempDir;

    try {
      // Validate language support
      if (!this.isLanguageSupported(language)) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const config = this.supportedLanguages[language];
      console.log(`🚀 Executing ${language} code for room ${roomId}`);

      // Create temporary directory and write code file
      tempDir = await this.createTempDirectory();
      const codeFile = path.join(tempDir, `code${config.extension}`);
      await fs.writeFile(codeFile, code, "utf8");

      // Create empty input.txt file for programs that expect input
      const inputFile = path.join(tempDir, "input.txt");
      await fs.writeFile(inputFile, "", "utf8");

      console.log(`📁 Created temp directory: ${tempDir}`);
      console.log(`📄 Code file: ${codeFile}`);

      if (config.setupFiles) {
        await this.writeSetupFiles(tempDir, config.setupFiles);
      }

      // Execute code using the unified command approach
      const userTimeout = Number(timeout);
      const hasUserTimeout = Number.isFinite(userTimeout) && userTimeout > 0;
      const configuredTimeout = config.timeout ?? this.defaultTimeout;
      const executeTimeout = hasUserTimeout
        ? userTimeout
        : configuredTimeout > 0
        ? configuredTimeout
        : this.defaultTimeout;

      const result = await this.runDockerCommand(
        config.image,
        config.command,
        tempDir,
        executeTimeout
      );

      const executionTime = Date.now() - startTime;
      console.log(
        `✅ Code execution completed in ${executionTime}ms for room ${roomId}`
      );

      return {
        success: true,
        output: result.output,
        error: result.error,
        executionTime,
        language,
        roomId,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(
        `❌ Code execution failed for room ${roomId}:`,
        error.message
      );

      return {
        success: false,
        output: "",
        error: error.message,
        executionTime,
        language,
        roomId,
      };
    } finally {
      // Cleanup temporary files
      if (tempDir) {
        await this.cleanupTempDirectory(tempDir);
      }
    }
  }

  /**
   * Write auxiliary setup files required for specific language runtimes
   */
  async writeSetupFiles(tempDir, files) {
    const entries = Object.entries(files);
    await Promise.all(
      entries.map(async ([fileName, contents]) => {
        const filePath = path.join(tempDir, fileName);
        const data =
          typeof contents === "string"
            ? contents
            : `${JSON.stringify(contents, null, 2)}\n`;
        await fs.writeFile(filePath, data, "utf8");
      })
    );
  }

  /**
   * Execute a command in a Docker container
   */
  async runDockerCommand(image, command, tempDir, timeout) {
    // Bind-mount tempDir into container /app and execute the command there
    const mountDir = tempDir.replace(/\\/g, "/"); // Normalize Windows backslashes
    const dockerArgs = [
      "run",
      "--rm",
      "--memory",
      this.maxMemory,
      "--cpus",
      this.maxCpus,
      "--network",
      "none",
      "--cap-drop",
      "ALL",
      "--security-opt",
      "no-new-privileges",
      "-v",
      `${mountDir}:/app:rw`, // Mount host tempDir to /app (read-write)
      "--workdir",
      "/app",
      image,
      "sh",
      "-c",
      command,
    ];
    console.log("🛠 Running Docker:", "docker", ...dockerArgs);
    return await this.runCommand("docker", dockerArgs, timeout);
  }

  /**
   * Run a system command with timeout
   */
  async runCommand(command, args, timeout = this.defaultTimeout) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      let stdout = "";
      let stderr = "";
      let killed = false;

      // Set timeout
      const timeoutId = setTimeout(() => {
        if (!killed) {
          killed = true;
          process.kill("SIGKILL");
          reject(new Error(`Process timed out after ${timeout}ms`));
        }
      }, timeout);

      // Collect stdout
      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      // Collect stderr
      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      // Handle process completion
      process.on("close", (code) => {
        clearTimeout(timeoutId);

        if (killed) return; // Already handled by timeout

        resolve({
          output: stdout.trim(),
          error: stderr.trim(),
          exitCode: code,
        });
      });

      // Handle process errors
      process.on("error", (error) => {
        clearTimeout(timeoutId);
        if (!killed) {
          reject(error);
        }
      });
    });
  }

  /**
   * Create a temporary directory for code execution
   */
  async createTempDirectory() {
    // Create a temp directory under project root (ensures Docker Desktop drive sharing)
    const projectRoot = path.resolve(__dirname, "../../..");
    // Use crypto.randomBytes for cryptographically secure random number generation
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const tempDirName = `code-exec-${Date.now()}-${randomSuffix}`;
    const tempDir = path.join(projectRoot, "tmp", tempDirName);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }

  /**
   * Clean up temporary directory
   */
  async cleanupTempDirectory(tempDir) {
    try {
      // Validate tempDir is within our controlled tmp directory
      const projectRoot = path.resolve(__dirname, "../../..");
      const expectedTmpPath = path.join(projectRoot, "tmp");
      const resolvedTempDir = path.resolve(tempDir);

      if (!resolvedTempDir.startsWith(expectedTmpPath)) {
        console.error(
          `⚠️ Security: Attempted to delete directory outside tmp: ${tempDir}`
        );
        return;
      }

      // Force remove with maxRetries for Windows file locking issues
      await fs.rm(resolvedTempDir, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
    } catch (error) {
      console.warn(
        `⚠️ Failed to cleanup temp directory ${tempDir}:`,
        error.message
      );
      // Try alternative cleanup method
      try {
        const files = await fs.readdir(tempDir);
        for (const file of files) {
          const filePath = path.resolve(tempDir, file);
          await fs.rm(filePath, { force: true });
        }
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (secondError) {
        console.warn(`⚠️ Secondary cleanup also failed:`, secondError.message);
      }
    }
  }

  /**
   * Get information about supported languages
   */
  getSupportedLanguages() {
    return Object.keys(this.supportedLanguages).map((lang) => ({
      id: lang,
      name: this.getLanguageDisplayName(lang),
      extension: this.supportedLanguages[lang].extension,
      requiresCompilation: this.supportedLanguages[lang].requiresCompilation,
    }));
  }

  /**
   * Get display name for language
   */
  getLanguageDisplayName(language) {
    const displayNames = {
      python: "Python",
      javascript: "JavaScript",
      typescript: "TypeScript",
    };
    return displayNames[language] ?? language;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language) {
    return Object.prototype.hasOwnProperty.call(
      this.supportedLanguages,
      language
    );
  }

  /**
   * Get execution statistics
   */
  getStats() {
    return {
      supportedLanguages: this.getSupportedLanguages(),
      defaultTimeout: this.defaultTimeout,
      maxMemory: this.maxMemory,
      maxCpus: this.maxCpus,
    };
  }

  /**
   * Update execution limits
   */
  updateLimits({ timeout, memory, cpus }) {
    if (timeout && timeout > 0) {
      this.defaultTimeout = timeout;
    }
    if (memory) {
      this.maxMemory = memory;
    }
    if (cpus) {
      this.maxCpus = cpus;
    }

    console.log(
      `🔧 Updated execution limits: timeout=${this.defaultTimeout}ms, memory=${this.maxMemory}, cpus=${this.maxCpus}`
    );
  }
}

module.exports = DockerExecutionService;

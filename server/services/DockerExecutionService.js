const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * DockerExecutionService handles secure code execution in isolated Docker containers
 * Features:
 * - Multi-language support (C++, Python, Go)
 * - Resource constraints and timeouts
 * - Secure container isolation
 * - Temporary file management
 * - Error handling and logging
 */
class DockerExecutionService {
  constructor() {
    this.supportedLanguages = {
      'cpp': {
        image: 'cpp-runner:latest',
        extension: '.cpp',
        compileCommand: 'g++ -o /app/program /app/code.cpp',
        runCommand: '/app/program',
        requiresCompilation: true
      },
      'python': {
        image: 'python-runner:latest',
        extension: '.py',
        compileCommand: null,
        runCommand: 'python /app/code.py',
        requiresCompilation: false
      },
      'go': {
        image: 'go-runner:latest',
        extension: '.go',
        compileCommand: 'go build -o /app/program /app/code.go',
        runCommand: '/app/program',
        requiresCompilation: true
      },
      'javascript': {
        image: 'node-runner:latest',
        extension: '.js',
        compileCommand: null,
        runCommand: 'node /app/code.js',
        requiresCompilation: false
      }
    };

    this.defaultTimeout = 10000; // 10 seconds
    this.maxMemory = '128m';
    this.maxCpus = '0.5';

    console.log('🐳 DockerExecutionService initialized');
    this.checkDockerAvailability();
  }

  /**
   * Check if Docker is available on the system
   */
  async checkDockerAvailability() {
    try {
      await this.runCommand('docker', ['--version']);
      console.log('✅ Docker is available');
    } catch (error) {
      console.error('❌ Docker is not available:', error.message);
      console.error('🔧 Please ensure Docker is installed and running');
    }
  }

  /**
   * Execute code in a Docker container
   */
  async executeCode(code, language, roomId, timeout = this.defaultTimeout) {
    const startTime = Date.now();
    
    try {
      // Validate language support
      if (!this.supportedLanguages[language]) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const config = this.supportedLanguages[language];
      console.log(`🚀 Executing ${language} code for room ${roomId}`);

      // Create temporary directory for this execution
      const tempDir = await this.createTempDirectory();
      const codeFile = path.join(tempDir, `code${config.extension}`);

      try {
        // Write code to temporary file
        await fs.writeFile(codeFile, code, 'utf8');

        let result;
        
        if (config.requiresCompilation) {
          // Compile and run
          result = await this.compileAndRun(config, tempDir, timeout);
        } else {
          // Run directly
          result = await this.runCode(config, tempDir, timeout);
        }

        const executionTime = Date.now() - startTime;
        console.log(`✅ Code execution completed in ${executionTime}ms for room ${roomId}`);

        return {
          success: true,
          output: result.output,
          error: result.error,
          executionTime,
          language,
          roomId
        };

      } finally {
        // Cleanup temporary files
        await this.cleanupTempDirectory(tempDir);
      }

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ Code execution failed for room ${roomId}:`, error.message);

      return {
        success: false,
        output: '',
        error: error.message,
        executionTime,
        language,
        roomId
      };
    }
  }

  /**
   * Compile and run code that requires compilation
   */
  async compileAndRun(config, tempDir, timeout) {
    // Compilation step
    const compileResult = await this.runDockerCommand(
      config.image,
      config.compileCommand,
      tempDir,
      timeout / 2 // Half timeout for compilation
    );

    if (compileResult.error) {
      return {
        output: compileResult.output,
        error: `Compilation Error: ${compileResult.error}`
      };
    }

    // Execution step
    const runResult = await this.runDockerCommand(
      config.image,
      config.runCommand,
      tempDir,
      timeout / 2 // Half timeout for execution
    );

    return {
      output: runResult.output,
      error: runResult.error
    };
  }

  /**
   * Run code directly without compilation
   */
  async runCode(config, tempDir, timeout) {
    return await this.runDockerCommand(
      config.image,
      config.runCommand,
      tempDir,
      timeout
    );
  }

  /**
   * Execute a command in a Docker container
   */
  async runDockerCommand(image, command, tempDir, timeout) {
    const dockerArgs = [
      'run',
      '--rm',                    // Remove container after execution
      '--memory', this.maxMemory, // Memory limit
      '--cpus', this.maxCpus,     // CPU limit
      '--network', 'none',        // No network access
      '--user', 'nobody',         // Run as unprivileged user
      '--read-only',              // Read-only filesystem
      '--tmpfs', '/tmp:size=10m,noexec', // Temporary filesystem for temp files
      '-v', `${tempDir}:/app:ro`, // Mount code directory to /app as read-only
      image,
      'sh', '-c', command
    ];

    return await this.runCommand('docker', dockerArgs, timeout);
  }

  /**
   * Run a system command with timeout
   */
  async runCommand(command, args, timeout = this.defaultTimeout) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      let stdout = '';
      let stderr = '';
      let killed = false;

      // Set timeout
      const timeoutId = setTimeout(() => {
        if (!killed) {
          killed = true;
          process.kill('SIGKILL');
          reject(new Error(`Process timed out after ${timeout}ms`));
        }
      }, timeout);

      // Collect stdout
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      // Collect stderr
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Handle process completion
      process.on('close', (code) => {
        clearTimeout(timeoutId);
        
        if (killed) return; // Already handled by timeout

        resolve({
          output: stdout.trim(),
          error: stderr.trim(),
          exitCode: code
        });
      });

      // Handle process errors
      process.on('error', (error) => {
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
    const tempDir = path.join(os.tmpdir(), `code-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }

  /**
   * Clean up temporary directory
   */
  async cleanupTempDirectory(tempDir) {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`⚠️ Failed to cleanup temp directory ${tempDir}:`, error.message);
    }
  }

  /**
   * Get information about supported languages
   */
  getSupportedLanguages() {
    return Object.keys(this.supportedLanguages).map(lang => ({
      id: lang,
      name: this.getLanguageDisplayName(lang),
      extension: this.supportedLanguages[lang].extension,
      requiresCompilation: this.supportedLanguages[lang].requiresCompilation
    }));
  }

  /**
   * Get display name for language
   */
  getLanguageDisplayName(language) {
    const displayNames = {
      'cpp': 'C++',
      'python': 'Python',
      'go': 'Go'
    };
    return displayNames[language] || language;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language) {
    return this.supportedLanguages.hasOwnProperty(language);
  }

  /**
   * Get execution statistics
   */
  getStats() {
    return {
      supportedLanguages: this.getSupportedLanguages(),
      defaultTimeout: this.defaultTimeout,
      maxMemory: this.maxMemory,
      maxCpus: this.maxCpus
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
    
    console.log(`🔧 Updated execution limits: timeout=${this.defaultTimeout}ms, memory=${this.maxMemory}, cpus=${this.maxCpus}`);
  }
}

module.exports = DockerExecutionService;

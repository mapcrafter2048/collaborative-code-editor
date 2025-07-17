# Language Extension Migration Guide

## 🎉 New Language Support Added!

Your collaborative code editor has been extended from 3 languages to **10 programming languages**!

### Previously Supported (3 languages):
- ✅ C++
- ✅ Python  
- ✅ JavaScript

### Newly Added (7 languages):
- 🆕 **C** - GCC compiler with C17 standard
- 🆕 **TypeScript** - Direct execution with ts-node
- 🆕 **Go** - Go 1.21 with module support
- 🆕 **Rust** - Rust 1.70 with Cargo build system
- 🆕 **Java** - OpenJDK 21 with standard libraries
- 🆕 **PHP** - PHP 8.2 CLI with extensions
- 🆕 **Ruby** - Ruby 3.2 with standard gems

## 🚀 Quick Start

### 1. Build New Docker Images
Run the build script to create Docker containers for all languages:

**Windows:**
```cmd
cd runner
build-images.bat
```

**Linux/macOS:**
```bash
cd runner
chmod +x build-images.sh
./build-images.sh
```

### 2. Test All Languages
Verify that all languages work correctly:

**Windows:**
```cmd
cd runner
test-runners.bat
```

**Linux/macOS:**
```bash
cd runner
chmod +x test-runners.sh
./test-runners.sh
```

### 3. Start Your Server
No changes needed to your existing server startup process:

```bash
# Terminal 1: Start the server
cd server
npm install
npm start

# Terminal 2: Start the frontend
npm install
npm run dev
```

## 🔧 What Changed

### Backend Changes
- **DockerExecutionService.js**: Extended with 7 new language configurations
- **Language mappings**: Added proper file extensions and execution commands
- **Display names**: Added friendly names for all languages

### Frontend Changes
- **LanguageSelector.tsx**: Added icons and display names for new languages
- **Type definitions**: Extended to support new language options

### Docker Infrastructure
- **New Dockerfiles**: 7 new secure, optimized container images
- **Build scripts**: Updated to build all language containers
- **Test scripts**: Added comprehensive testing for all languages

## 🎨 Language-Specific Features

### Compiled Languages (require compilation step):
- **C**: GCC with full C17 standard support
- **C++**: G++ with C++17 features  
- **Rust**: Cargo build system with dependency management
- **Java**: Javac compilation with OpenJDK 21

### Interpreted Languages (direct execution):
- **Python**: Python 3.11 with standard library
- **JavaScript**: Node.js 20 runtime
- **TypeScript**: ts-node for direct TypeScript execution
- **Go**: Go runtime with automatic module handling
- **PHP**: PHP 8.2 CLI with standard extensions
- **Ruby**: Ruby 3.2 with gem support

## 🔒 Security Features (All Languages)

- **Container Isolation**: Each execution runs in isolated Docker container
- **Resource Limits**: 128MB memory, 0.5 CPU cores per execution
- **Network Isolation**: No network access during code execution
- **Timeout Protection**: 10-second execution limit
- **Non-root Execution**: All containers run as unprivileged users
- **Read-only Filesystem**: Root filesystem mounted as read-only

## 📋 Sample Code for New Languages

### C
```c
#include <stdio.h>
int main() {
    printf("Hello from C!\n");
    return 0;
}
```

### TypeScript
```typescript
function greet(name: string): void {
    console.log(`Hello, ${name}!`);
}
greet("TypeScript");
```

### Go
```go
package main
import "fmt"
func main() {
    fmt.Println("Hello from Go!")
}
```

### Rust
```rust
fn main() {
    println!("Hello from Rust!");
}
```

### Java
```java
public class code {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}
```

### PHP
```php
<?php
echo "Hello from PHP!\n";
?>
```

### Ruby
```ruby
puts "Hello from Ruby!"
```

## 🔍 Troubleshooting

### Docker Issues
If you encounter Docker-related problems:
1. Ensure Docker is running
2. Check that your user has Docker permissions
3. Try rebuilding images: `docker system prune -f && ./build-images.sh`

### Language-Specific Issues
- **Rust**: Ensure Cargo.toml is properly configured (auto-generated)
- **Java**: Class name must be "code" for proper execution
- **Go**: Module initialization happens automatically

### Performance Issues
- All languages share the same resource limits
- Compilation languages (C, C++, Rust, Java) may take longer
- Consider increasing timeout for complex programs

## 🎊 Enjoy Your Extended Code Editor!

You now have a powerful collaborative coding environment supporting 10 popular programming languages. Happy coding! 🚀

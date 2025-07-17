# Language Templates for Collaborative Code Editor

This directory contains sample code templates for all supported languages to help users get started quickly.

## Quick Start Templates

### C
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

### C++
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```

### Python
```python
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
```

### JavaScript
```javascript
function main() {
    console.log("Hello, World!");
}

main();
```

### TypeScript
```typescript
function main(): void {
    console.log("Hello, World!");
}

main();
```

### Go
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

### Rust
```rust
fn main() {
    println!("Hello, World!");
}
```

### Java
```java
public class code {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### PHP
```php
<?php
function main() {
    echo "Hello, World!\n";
}

main();
?>
```

### Ruby
```ruby
def main
    puts "Hello, World!"
end

main
```

## Language-Specific Notes

### C/C++
- Files are compiled with GCC
- Standard libraries are available
- Compilation errors will be shown before execution
- 10-second execution timeout

### Python
- Python 3.11 with standard library
- No external packages installed
- Direct execution without compilation

### JavaScript/TypeScript
- Node.js 20 runtime
- TypeScript compiled with ts-node
- CommonJS modules supported

### Go
- Go 1.21 with modules support
- Automatic module initialization
- Standard library available

### Rust
- Rust 1.70 with Cargo
- Compilation required before execution
- Standard library available

### Java
- OpenJDK 21
- Class name must be "code"
- Standard library available

### PHP
- PHP 8.2 CLI
- Standard extensions available
- Direct execution

### Ruby
- Ruby 3.2
- Standard gems available
- Direct execution

## Input/Output Handling

All languages support:
- Standard input/output
- Command line execution
- 10-second timeout limit
- Memory limit of 128MB
- CPU limit of 0.5 cores

## Security Features

- Isolated Docker containers
- No network access
- Resource constraints
- Non-root execution
- Read-only filesystem

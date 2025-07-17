/**
 * Room model representing a collaborative coding session
 * Manages users, code state, and room metadata
 */
class Room {
  constructor(id, language = 'javascript') {
    this.id = id;
    this.language = language;
    this.code = this.getDefaultCode(language);
    this.users = new Set();
    this.createdAt = new Date();
    this.lastActivity = new Date();
    this.cursors = new Map(); // userId -> cursor position
  }

  /**
   * Get default starter code for each language
   */
  getDefaultCode(language) {
    const defaultCodes = {
      'c': `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      'cpp': `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      'python': `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
      'javascript': `function main() {
    console.log("Hello, World!");
}

main();`,
      'typescript': `function main(): void {
    console.log("Hello, World!");
}

main();`,
      'go': `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
      'rust': `fn main() {
    println!("Hello, World!");
}`,
      'java': `public class code {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      'php': `<?php
echo "Hello, World!\\n";
?>`,
      'ruby': `def main
    puts "Hello, World!"
end

main`
    };

    return defaultCodes[language] || defaultCodes['javascript'];
  }

  /**
   * Add a user to the room
   */
  addUser(userId, socketId) {
    this.users.add(userId);
    this.updateActivity();
    console.log(`👤 User ${userId} joined room ${this.id}`);
  }

  /**
   * Remove a user from the room
   */
  removeUser(userId) {
    this.users.delete(userId);
    this.cursors.delete(userId);
    this.updateActivity();
    console.log(`👤 User ${userId} left room ${this.id}`);
    
    // Return true if room should be cleaned up (no users left)
    return this.users.size === 0;
  }

  /**
   * Update room code content
   */
  updateCode(newCode, userId) {
    this.code = newCode;
    this.updateActivity();
    console.log(`📝 Code updated in room ${this.id} by user ${userId}`);
  }

  /**
   * Update user cursor position
   */
  updateCursor(userId, cursor) {
    this.cursors.set(userId, cursor);
    this.updateActivity();
  }

  /**
   * Change room language and reset code
   */
  changeLanguage(newLanguage, userId) {
    this.language = newLanguage;
    this.code = this.getDefaultCode(newLanguage);
    this.updateActivity();
    console.log(`🔄 Language changed to ${newLanguage} in room ${this.id} by user ${userId}`);
  }

  /**
   * Get current room state
   */
  getState() {
    return {
      id: this.id,
      language: this.language,
      code: this.code,
      userCount: this.users.size,
      users: Array.from(this.users),
      cursors: Object.fromEntries(this.cursors),
      lastActivity: this.lastActivity,
      createdAt: this.createdAt
    };
  }

  /**
   * Check if room is empty
   */
  isEmpty() {
    return this.users.size === 0;
  }

  /**
   * Update last activity timestamp
   */
  updateActivity() {
    this.lastActivity = new Date();
  }

  /**
   * Check if room is stale (inactive for too long)
   */
  isStale(maxInactiveMinutes = 60) {
    const now = new Date();
    const inactiveTime = now - this.lastActivity;
    return inactiveTime > (maxInactiveMinutes * 60 * 1000);
  }
}

module.exports = Room;

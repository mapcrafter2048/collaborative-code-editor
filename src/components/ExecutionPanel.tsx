"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import type { ExecutionPanelProps } from "../types";

/**
 * ExecutionPanel component for code execution and results display
 * Features:
 * - Code execution trigger
 * - Results display with syntax highlighting
 * - Error handling and display
 * - Execution timing information
 * - Collapsible output panel
 */
const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  result,
  isExecuting,
  onExecute,
  disabled = false,
}) => {
  const [isOutputVisible, setIsOutputVisible] = useState(true);

  const toggleOutput = () => {
    setIsOutputVisible(!isOutputVisible);
  };

  const formatExecutionTime = (time: number): string => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  const getStatusColor = () => {
    if (isExecuting) return "text-blue-600";
    if (!result) return "text-gray-600";
    return result.success ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = () => {
    if (isExecuting) return "⏳";
    if (!result) return "⚪";
    return result.success ? "✅" : "❌";
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={onExecute}
            disabled={disabled || isExecuting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <span className="mr-2">▶️</span>
                Run Code
              </>
            )}
          </Button>
          {result && (
            <div
              className={`flex items-center gap-2 text-sm ${getStatusColor()}`}
            >
              <span>{getStatusIcon()}</span>
              <span>
                {result.success ? "Success" : "Error"}
                {result.executionTime > 0 &&
                  ` (${formatExecutionTime(result.executionTime)})`}
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={toggleOutput}
          variant="ghost"
          size="sm"
          className="text-gray-600 dark:text-gray-400"
        >
          {isOutputVisible ? "🔽" : "🔼"}
          {isOutputVisible ? "Hide" : "Show"} Output
        </Button>
      </div>
      {/* Output Panel */}
      {isOutputVisible && (
        <div className="p-4 flex-1 overflow-auto min-h-[80px]">
          {isExecuting ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Executing code...
                </span>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Output */}
              {result.output && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output:
                  </h4>
                  <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 text-sm font-mono overflow-x-auto">
                    <code className="text-gray-800 dark:text-gray-200">
                      {result.output}
                    </code>
                  </pre>
                </div>
              )}
              {/* Error */}
              {result.error && (
                <div>
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                    Error:
                  </h4>
                  <pre className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-3 text-sm font-mono overflow-x-auto">
                    <code className="text-red-800 dark:text-red-200">
                      {result.error}
                    </code>
                  </pre>
                </div>
              )}
              {/* No output or error */}
              {!result.output && !result.error && (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  No output.
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              No output yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionPanel;

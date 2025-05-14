
import { useEffect, useRef } from "react";

interface CodePreviewProps {
  code: string;
}

const CodePreview = ({ code }: CodePreviewProps) => {
  const codeRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    if (codeRef.current) {
      const highlightedCode = highlightCode(code);
      codeRef.current.innerHTML = highlightedCode;
    }
  }, [code]);

  // Function to highlight PHP code
  const highlightCode = (code: string): string => {
    let highlighted = code
      // Escape HTML tags
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Highlight PHP tags
    highlighted = highlighted.replace(/&lt;\?php/g, '<span class="text-purple-500">&lt;?php</span>');
    highlighted = highlighted.replace(/\?&gt;/g, '<span class="text-purple-500">?&gt;</span>');
    
    // Highlight array syntax
    highlighted = highlighted.replace(/return\s+\[/g, '<span class="text-purple-500">return</span> <span class="text-yellow-500">[</span>');
    highlighted = highlighted.replace(/\]\s*;/g, '<span class="text-yellow-500">]</span><span class="text-purple-500">;</span>');
    
    // Highlight keys
    highlighted = highlighted.replace(/'([^']+)'\s*=>/g, '<span class="text-blue-500">\'$1\'</span> =>');
    highlighted = highlighted.replace(/"([^"]+)"\s*=>/g, '<span class="text-blue-500">"$1"</span> =>');
    
    // Highlight values
    highlighted = highlighted.replace(/=>\s*'([^']+)'/g, '=> <span class="text-green-500">\'$1\'</span>');
    highlighted = highlighted.replace(/=>\s*"([^"]+)"/g, '=> <span class="text-green-500">"$1"</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(
      /\/\*[\s\S]*?\*\//g, 
      (match) => `<span class="text-gray-400 italic">${match}</span>`
    );
    highlighted = highlighted.replace(
      /\/\/.*$/gm, 
      (match) => `<span class="text-gray-400 italic">${match}</span>`
    );
    highlighted = highlighted.replace(
      /#.*$/gm, 
      (match) => `<span class="text-gray-400 italic">${match}</span>`
    );
    
    return highlighted;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
      <pre ref={codeRef} className="text-gray-100 whitespace-pre-wrap" />
    </div>
  );
};

export default CodePreview;

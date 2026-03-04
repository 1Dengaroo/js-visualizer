"use client";

import { useRef, useCallback } from "react";

interface HighlightedEditorProps {
  value: string;
  onChange: (value: string) => void;
  highlightRange?: { start: number; end: number } | null;
  readOnly?: boolean;
}

type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "function"
  | "punctuation"
  | "text";

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "function",
  "const",
  "let",
  "var",
  "if",
  "else",
  "return",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "throw",
  "try",
  "catch",
  "finally",
  "typeof",
  "instanceof",
  "void",
  "delete",
  "in",
  "of",
  "class",
  "extends",
  "import",
  "export",
  "default",
  "from",
  "async",
  "await",
  "yield",
  "this",
  "super",
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Line comments
    if (code[i] === "/" && code[i + 1] === "/") {
      const start = i;
      while (i < code.length && code[i] !== "\n") i++;
      tokens.push({ type: "comment", value: code.slice(start, i) });
      continue;
    }

    // Block comments
    if (code[i] === "/" && code[i + 1] === "*") {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      tokens.push({ type: "comment", value: code.slice(start, i) });
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const quote = code[i];
      const start = i;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === "\\") i++;
        i++;
      }
      i++;
      tokens.push({ type: "string", value: code.slice(start, i) });
      continue;
    }

    // Numbers
    if (/\d/.test(code[i])) {
      const start = i;
      while (i < code.length && /[\d.]/.test(code[i])) i++;
      tokens.push({ type: "number", value: code.slice(start, i) });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++;
      const word = code.slice(start, i);

      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (i < code.length && code[i] === "(") {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "text", value: word });
      }
      continue;
    }

    // Arrow
    if (code[i] === "=" && code[i + 1] === ">") {
      tokens.push({ type: "punctuation", value: "=>" });
      i += 2;
      continue;
    }

    // Punctuation
    if (/[{}()\[\];,.:=<>!&|?+\-*/%^~]/.test(code[i])) {
      tokens.push({ type: "punctuation", value: code[i] });
      i++;
      continue;
    }

    // Whitespace and other
    tokens.push({ type: "text", value: code[i] });
    i++;
  }

  return tokens;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightCode(
  code: string,
  highlightRange?: { start: number; end: number } | null,
): string {
  const tokens = tokenize(code);

  if (!highlightRange) {
    return tokens
      .map((token) => {
        const escaped = escapeHtml(token.value);
        if (token.type === "text") return escaped;
        return `<span class="token-${token.type}">${escaped}</span>`;
      })
      .join("");
  }

  // Build HTML with <mark> tags at the correct character positions
  let html = "";
  let charPos = 0;
  const { start, end } = highlightRange;

  for (const token of tokens) {
    const tokenStart = charPos;
    const tokenEnd = charPos + token.value.length;

    // No overlap with highlight range
    if (tokenEnd <= start || tokenStart >= end) {
      const escaped = escapeHtml(token.value);
      html +=
        token.type === "text"
          ? escaped
          : `<span class="token-${token.type}">${escaped}</span>`;
    }
    // Fully inside highlight range
    else if (tokenStart >= start && tokenEnd <= end) {
      const escaped = escapeHtml(token.value);
      const inner =
        token.type === "text"
          ? escaped
          : `<span class="token-${token.type}">${escaped}</span>`;
      html += `<mark class="code-highlight">${inner}</mark>`;
    }
    // Partially overlapping — split the token
    else {
      const parts: { text: string; highlighted: boolean }[] = [];
      const val = token.value;

      // Before highlight
      if (tokenStart < start) {
        parts.push({
          text: val.slice(0, start - tokenStart),
          highlighted: false,
        });
      }
      // Highlighted portion
      const hlStart = Math.max(0, start - tokenStart);
      const hlEnd = Math.min(val.length, end - tokenStart);
      parts.push({
        text: val.slice(hlStart, hlEnd),
        highlighted: true,
      });
      // After highlight
      if (tokenEnd > end) {
        parts.push({
          text: val.slice(end - tokenStart),
          highlighted: false,
        });
      }

      for (const part of parts) {
        const escaped = escapeHtml(part.text);
        const wrapped =
          token.type === "text"
            ? escaped
            : `<span class="token-${token.type}">${escaped}</span>`;
        html += part.highlighted
          ? `<mark class="code-highlight">${wrapped}</mark>`
          : wrapped;
      }
    }

    charPos = tokenEnd;
  }

  return html;
}

export function HighlightedEditor({
  value,
  onChange,
  highlightRange,
  readOnly,
}: HighlightedEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      <pre
        ref={preRef}
        className="absolute inset-0 p-5 m-0 overflow-hidden pointer-events-none text-base whitespace-pre-wrap break-words text-code-text"
        style={{ fontFamily: "var(--font-source-code), monospace" }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: highlightCode(value, highlightRange) + "\n",
        }}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        readOnly={readOnly}
        className={`absolute inset-0 w-full h-full bg-transparent text-transparent caret-code-text text-base p-5 resize-none outline-none whitespace-pre-wrap break-words${
          readOnly ? " cursor-default opacity-70" : ""
        }`}
        style={{ fontFamily: "var(--font-source-code), monospace" }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}

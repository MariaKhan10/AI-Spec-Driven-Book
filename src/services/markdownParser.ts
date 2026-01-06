import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkStringify from 'remark-stringify';
import type { Root, Content, Paragraph, Heading, Code, Data } from 'mdast';
import { visit } from 'unist-util-visit';

// Extend the Data interface to include our custom properties
interface ExtendedData extends Data {
  transformed?: boolean;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  explanationAdded?: boolean;
  practicalExamplesAdded?: boolean;
  advancedExamplesAdded?: boolean;
}

/**
 * Service for parsing and transforming Markdown content using AST
 */
export class MarkdownParser {
  /**
   * Parse Markdown content into AST
   */
  async parseToAst(content: string): Promise<Root> {
    const file = await unified()
      .use(remarkParse)
      .parse(content);

    return file as Root;
  }

  /**
   * Transform Markdown AST based on complexity level
   */
  transformAstByComplexity(ast: Root, complexity: 'beginner' | 'intermediate' | 'advanced'): Root {
    // Create a deep copy of the AST to avoid modifying the original
    const transformedAst = JSON.parse(JSON.stringify(ast)) as Root;

    // Apply transformations based on complexity level
    switch (complexity) {
      case 'beginner':
        return this.transformForBeginner(transformedAst);
      case 'intermediate':
        return this.transformForIntermediate(transformedAst);
      case 'advanced':
        return this.transformForAdvanced(transformedAst);
      default:
        return transformedAst;
    }
  }

  /**
   * Transform AST for beginner level
   */
  private transformForBeginner(ast: Root): Root {
    // Add more descriptive text, simplify language, add analogies
    visit(ast, 'paragraph', (node: Content) => {
      if (node.type === 'paragraph') {
        // In a real implementation, we would transform the paragraph content
        // to be more beginner-friendly
        // For now, we'll just add a simple transformation marker to the data object
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'beginner'
        };
        node.data = extendedData;
      }
    });

    // Add more explanations for code blocks
    visit(ast, 'code', (node: Content) => {
      if (node.type === 'code') {
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'beginner',
          explanationAdded: true
        };
        node.data = extendedData;
      }
    });

    // Add more descriptive headings
    visit(ast, 'heading', (node: Content) => {
      if (node.type === 'heading') {
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'beginner'
        };
        node.data = extendedData;
      }
    });

    return ast;
  }

  /**
   * Transform AST for intermediate level
   */
  private transformForIntermediate(ast: Root): Root {
    // Add practical tips and moderate examples
    visit(ast, 'paragraph', (node: Content) => {
      if (node.type === 'paragraph') {
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'intermediate'
        };
        node.data = extendedData;
      }
    });

    // Add code snippets and practical examples
    visit(ast, 'code', (node: Content) => {
      if (node.type === 'code') {
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'intermediate',
          practicalExamplesAdded: true
        };
        node.data = extendedData;
      }
    });

    return ast;
  }

  /**
   * Transform AST for advanced level
   */
  private transformForAdvanced(ast: Root): Root {
    // Add detailed explanations and advanced techniques
    visit(ast, 'paragraph', (node: Content) => {
      if (node.type === 'paragraph') {
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'advanced'
        };
        node.data = extendedData;
      }
    });

    // Add advanced code examples and optimizations
    visit(ast, 'code', (node: Content) => {
      if (node.type === 'code') {
        const extendedData: ExtendedData = {
          ...node.data,
          transformed: true,
          complexity: 'advanced',
          advancedExamplesAdded: true
        };
        node.data = extendedData;
      }
    });

    return ast;
  }

  /**
   * Convert AST back to Markdown string
   */
  async astToString(ast: Root): Promise<string> {
    // Convert the modified AST back to markdown string
    const file = await unified()
      .use(remarkStringify)
      .stringify(ast);

    return String(file);
  }

  /**
   * Transform Markdown content directly
   */
  async transformContent(
    content: string,
    complexity: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<string> {
    try {
      // Parse to AST
      const ast = await this.parseToAst(content);

      // Transform based on complexity
      const transformedAst = this.transformAstByComplexity(ast, complexity);

      // Convert back to string
      return await this.astToString(transformedAst);
    } catch (error) {
      console.error('Error transforming content with AST:', error);
      // Return original content if transformation fails
      return content;
    }
  }

  /**
   * Preserve structure elements like headings, code blocks, links, etc.
   */
  preserveStructure(ast: Root): Root {
    // This method would ensure that structure elements are preserved
    // during transformation. The current implementation already preserves
    // structure through the unified/remark/rehype pipeline.
    return ast;
  }

  /**
   * Extract learning objectives from content
   */
  extractLearningObjectives(ast: Root): string[] {
    const objectives: string[] = [];

    visit(ast, 'paragraph', (node: Content) => {
      if (node.type === 'paragraph') {
        // Look for common learning objective patterns
        // This is a simplified implementation
        const text = this.extractTextFromNode(node);
        if (text.toLowerCase().includes('objective') ||
            text.toLowerCase().includes('learn') ||
            text.toLowerCase().includes('understand')) {
          objectives.push(text);
        }
      }
    });

    return objectives;
  }

  /**
   * Extract text content from a node
   */
  private extractTextFromNode(node: Content): string {
    if (node.type === 'text') {
      return (node as any).value as string;
    }

    if ('children' in node && Array.isArray(node.children)) {
      return node.children.map(child => this.extractTextFromNode(child as Content)).join(' ');
    }

    return '';
  }

  /**
   * Count words in content (for complexity assessment)
   */
  countWords(ast: Root): number {
    let count = 0;

    visit(ast, 'text', (node: Content) => {
      if (node.type === 'text') {
        count += (node as any).value.trim().split(/\s+/).filter(word => word.length > 0).length;
      }
    });

    return count;
  }
}

// Export singleton instance
export const markdownParser = new MarkdownParser();
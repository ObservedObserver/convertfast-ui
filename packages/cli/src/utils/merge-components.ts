import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export function mergeComponents(components: string[]): string {
  const asts = components.map((component, index) => {
    try {
      return parse(component, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
    } catch (error: any) {
      console.error(`Error parsing component ${index + 1}:`, error);
      console.error("Problematic code:", component);
      throw error;
    }
  });

  const imports: Map<string, t.ImportDeclaration> = new Map();
  const constants: t.VariableDeclaration[] = [];
  const jsxElements: t.JSXElement[] = [];

  asts.forEach((ast, index) => {
    traverse.default(ast, {
      ImportDeclaration(path) {
        const importSource = path.node.source.value;
        if (!imports.has(importSource)) {
          imports.set(importSource, t.cloneNode(path.node));
        } else {
          const existingImport = imports.get(importSource)!;
          path.node.specifiers.forEach((specifier) => {
            if (
              !existingImport.specifiers.some((s) => s.type === specifier.type && s.local.name === specifier.local.name)
            ) {
              existingImport.specifiers.push(t.cloneNode(specifier));
            }
          });
        }
      },
      VariableDeclaration(path) {
        if (path.node.kind === "const") {
          path.node.declarations.forEach((declaration) => {
            if (
              t.isVariableDeclarator(declaration) &&
              t.isArrowFunctionExpression(declaration.init) &&
              t.isIdentifier(declaration.id) &&
              declaration.id.name.match(/^[A-Z]/)
            ) {
              // This is a React functional component
              extractJSXFromComponent(path, declaration.init, index);
            } else {
              constants.push(t.cloneNode(path.node));
            }
          });
        }
      },
      FunctionDeclaration(path) {
        if (path.node.id && path.node.id.name.match(/^[A-Z]/)) {
          extractJSXFromComponent(path, path.node, index);
        }
      },
    });
  });

  function extractJSXFromComponent(
    path: traverse.NodePath,
    node: t.FunctionDeclaration | t.ArrowFunctionExpression,
    index: number
  ) {
    let returnStatement: t.ReturnStatement | null = null;

    path.traverse({
      ReturnStatement(returnPath) {
        if (t.isJSXElement(returnPath.node.argument)) {
          returnStatement = t.cloneNode(returnPath.node);
        }
      },
    });

    if (returnStatement && t.isJSXElement(returnStatement.argument)) {
      jsxElements.push(
        t.jsxElement(
          t.jsxOpeningElement(
            t.jsxIdentifier("div"),
            [t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral(`section-${index + 1}`))],
            false
          ),
          t.jsxClosingElement(t.jsxIdentifier("div")),
          [returnStatement.argument],
          false
        )
      );
    }
  }

  const programBody: t.Statement[] = [];

  // Add React import if not present
  if (!imports.has("react")) {
    programBody.push(t.importDeclaration([t.importDefaultSpecifier(t.identifier("React"))], t.stringLiteral("react")));
  }

  // Add other imports
  imports.forEach((importNode) => {
    programBody.push(importNode);
  });

  // Add constants
  constants.forEach((constant) => {
    programBody.push(constant);
  });

  // Create merged component
  const mergedComponent = t.functionDeclaration(
    t.identifier("MergedComponent"),
    [],
    t.blockStatement([
      t.returnStatement(
        t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier("div"), [], false),
          t.jsxClosingElement(t.jsxIdentifier("div")),
          jsxElements,
          false
        )
      ),
    ])
  );

  // mergedComponent.returnType = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("JSX.Element")));

  programBody.push(mergedComponent);
  programBody.push(t.exportDefaultDeclaration(t.identifier("MergedComponent")));

  const combinedAst = t.file(t.program(programBody));

  try {
    const { code } = generate.default(combinedAst, {
      retainLines: false,
      compact: false,
      jsescOption: {
        minimal: true,
      },
      minified: false,
      concise: false,
      decoratorsBeforeExport: true,
      sourceMaps: false,
    }, components.join('\n'));

    // Additional formatting
    return code
      .replace(/;$/, '') // Remove trailing semicolon
      .replace(/\n{3,}/g, '\n\n') // Replace multiple blank lines with a single blank line
      .replace(/{\s*\n\s*}/g, '{}') // Replace empty blocks with {}
      .trim(); // Trim leading and trailing whitespace
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

export function mergeComponents(components: string[]): string {
  const asts = components.map((component, index) => {
    try {
      const ast = parse(component, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });
      
      if (!ast || !Array.isArray(ast.program.body)) {
        console.error(`Invalid AST structure for component ${index + 1}:`, JSON.stringify(ast, null, 2));
        throw new Error(`Invalid AST structure for component ${index + 1}`);
      }
      
      return ast;
    } catch (error: any) {
      console.error(`Error parsing component ${index + 1}:`, error);
      console.error('Problematic code:', component);
      throw error;
    }
  });

  const combinedAst: t.File = {
    type: "File",
    program: t.program([
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier('React'))],
        t.stringLiteral('react')
      )
    ]),
    comments: null,
    loc: null,
  };

  const jsxElements: t.JSXElement[] = [];

  asts.forEach((ast, index) => {
    traverse.default(ast, {
      ReturnStatement(path) {
        if (t.isJSXElement(path.node.argument)) {
          jsxElements.push(
            t.jsxElement(
              t.jsxOpeningElement(t.jsxIdentifier('div'), [
                t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral(`component-${index + 1}`))
              ], false),
              t.jsxClosingElement(t.jsxIdentifier('div')),
              [path.node.argument],
              false
            )
          );
        }
      }
    });
  });

  const mergedComponent = t.functionDeclaration(
    t.identifier('MergedComponent'),
    [],
    t.blockStatement([
      t.returnStatement(
        t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier('div'), [], false),
          t.jsxClosingElement(t.jsxIdentifier('div')),
          jsxElements,
          false
        )
      )
    ])
  );

  mergedComponent.returnType = t.tsTypeAnnotation(
    t.tsTypeReference(t.identifier('JSX.Element'))
  );

  combinedAst.program.body.push(mergedComponent);
  combinedAst.program.body.push(
    t.exportDefaultDeclaration(t.identifier('MergedComponent'))
  );

  try {
    const { code } = generate.default(combinedAst, {
      retainLines: true,
      compact: false,
      jsescOption: {
        minimal: true,
      },
    });
    return code;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}
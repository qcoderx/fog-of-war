import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function cjsProtoPlugin() {
  return {
    name: 'cjs-proto',
    transform(code, id) {
      if (!/game_pb\.js$|game_grpc_web_pb\.js$/.test(id)) return null;

      const imports = [];
      let idx = 0;
      let out = code;

      // var/const/let name = require('mod')
      out = out.replace(
        /\b(?:var|const|let)\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)\s*;?/g,
        (_, name, mod) => {
          const tmp = `__cjsImport${idx++}`;
          imports.push(`import ${tmp} from "${mod}";`);
          return `var ${name} = ${tmp};`;
        }
      );

      // obj.prop = require('mod')
      out = out.replace(
        /(\w+\.\w+)\s*=\s*require\(['"]([^'"]+)['"]\)\s*;?/g,
        (_, lhs, mod) => {
          const tmp = `__cjsImport${idx++}`;
          imports.push(`import ${tmp} from "${mod}";`);
          return `${lhs} = ${tmp};`;
        }
      );

      // module.exports = X
      out = out.replace(/module\.exports\s*=\s*([^;\n]+);?/, 'export default $1;');

      // goog.object.extend(exports, X)
      out = out.replace(/goog\.object\.extend\(exports,\s*([^)]+)\)\s*;?/, 'export default $1;');

      return {
        code: imports.join('\n') + '\nvar exports = {};\n' + out,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [cjsProtoPlugin(), react()],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'google-protobuf', 'grpc-web'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

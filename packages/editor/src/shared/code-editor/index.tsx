import Editor, { EditorProps, Monaco, OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { CSSProperties, useRef } from 'react'
import React from 'react'

export type EditorOptions = Parameters<monaco.editor.IStandaloneCodeEditor['updateOptions']>[0]

export function CodeEditor({
  readOnly,
  lineNumbers = 'off',
  style,
  ...props
}: EditorProps & { readOnly?: boolean; style?: CSSProperties; lineNumbers?: EditorOptions['lineNumbers'] }) {
  const monacoRef = useRef(null)

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  }

  const handleEditorDidMount: OnMount = function (editor, monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = editor
    editor.updateOptions({
      readOnly,
      lineNumbers,
      minimap: {
        enabled: false
      },
      lineDecorationsWidth: 0,
      glyphMargin: false,
      folding: false
    })
  }
  React.useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.updateOptions({
        readOnly,
        lineNumbers
      })
    }
  }, [readOnly, lineNumbers])

  return (
    <div style={style}>
      <Editor
        language="typescript"
        height={'200px'}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        {...props}
      />
    </div>
  )
}

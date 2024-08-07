import * as vscode from "vscode";

import { executeCommand, ExpectedDocument, groupTestsByParentName } from "../utils";

suite("./test/suite/commands/seek-enclosing-surround.md", function () {
  // Set up document.
  let document: vscode.TextDocument,
      editor: vscode.TextEditor;

  this.beforeAll(async () => {
    document = await vscode.workspace.openTextDocument({ language: "plaintext" });
    editor = await vscode.window.showTextDocument(document);
    await editor.edit((edit) => edit.setEndOfLine(vscode.EndOfLine.LF));
    editor.options.insertSpaces = true;
    editor.options.tabSize = 2;

    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });
  });

  this.afterAll(async () => {
    await executeCommand("workbench.action.closeActiveEditor");
  });

  test("caret > jump", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                | 0
    `);

    // Perform all operations.
    await executeCommand("dance.seek.enclosingSurround");

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:8:1", 6, String.raw`
      (test { toast } test)
                     | 0
    `);
  });

  test("caret > jump-twice", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                | 0
    `);

    // Perform all operations.
    await executeCommand("dance.seek.enclosingSurround", { inner: true });
    await executeCommand("dance.seek.enclosingSurround", { inner: true });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:18:1", 6, String.raw`
      (test { toast } test)
             | 0
    `);
  });

  test("caret > extend", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                | 0
    `);

    // Perform all operations.
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend", inner: true });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:30:1", 6, String.raw`
      (test { toast } test)
                ^^^| 0
    `);
  });

  test("caret > extend-twice", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                | 0
    `);

    // Perform all operations.
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend", inner: true });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend", inner: true });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:39:1", 6, String.raw`
      (test { toast } test)
             |^^ 0
    `);
  });

  test("caret-anchor > extend", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                |^^^^^^^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend", inner: true });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:57:1", 6, String.raw`
      (test { toast } test)
                    |^^^ 0
    `);
  });

  test("caret-anchor > extend-twice", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                |^^^^^^^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend", inner: true });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend", inner: true });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:67:1", 6, String.raw`
      (test { toast } test)
             |^^^^^^^^^^ 0
    `);
  });

  test("char > jump", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                ^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "character" });
    await executeCommand("dance.seek.enclosingSurround");
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:89:1", 6, String.raw`
      (test { toast } test)
                    ^ 0
    `);
  });

  test("char > jump-twice", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                ^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "character" });
    await executeCommand("dance.seek.enclosingSurround");
    await executeCommand("dance.seek.enclosingSurround");
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:98:1", 6, String.raw`
      (test { toast } test)
            ^ 0
    `);
  });

  test("char > extend", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                ^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "character" });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend" });
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:109:1", 6, String.raw`
      (test { toast } test)
                ^^^^^ 0
    `);
  });

  test("char > extend-twice", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                ^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "character" });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend" });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend" });
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:119:1", 6, String.raw`
      (test { toast } test)
            |^^^^ 0
    `);
  });

  test("char-anchor > extend", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                |^^^^^^^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "character" });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend" });
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:140:1", 6, String.raw`
      (test { toast } test)
                    |^^^ 0
    `);
  });

  test("char-anchor > extend-twice", async function () {
    // Set-up document to be in expected initial state.
    await ExpectedDocument.apply(editor, 6, String.raw`
      (test { toast } test)
                |^^^^^^^ 0
    `);

    // Perform all operations.
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "character" });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend" });
    await executeCommand("dance.seek.enclosingSurround", { shift: "extend" });
    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });

    // Ensure document is as expected.
    ExpectedDocument.assertEquals(editor, "./test/suite/commands/seek-enclosing-surround.md:150:1", 6, String.raw`
      (test { toast } test)
            |^^^^^^^^^^^ 0
    `);
  });

  groupTestsByParentName(this);
});

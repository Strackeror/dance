import * as vscode from "vscode";

import { ExpectedDocument } from "../utils";

const executeCommand = vscode.commands.executeCommand;

suite("edit-paste-before.md", function () {
  // Set up document.
  let document: vscode.TextDocument,
      editor: vscode.TextEditor;

  this.beforeAll(async () => {
    document = await vscode.workspace.openTextDocument();
    editor = await vscode.window.showTextDocument(document);

    await executeCommand("dance.dev.setSelectionBehavior", { mode: "normal", value: "caret" });
  });

  this.afterAll(async () => {
    await executeCommand("workbench.action.closeActiveEditor");
  });

  // Each test sets up using its previous document, and notifies its
  // dependents that it is done by writing its document to `documents`.
  // This ensures that tests are executed in the right order, and that we skip
  // tests whose dependencies failed.
  const notifyDependents: Record<string, (document: ExpectedDocument | undefined) => void> = {},
        documents: Record<string, Promise<ExpectedDocument | undefined>> = {
          "1": Promise.resolve(ExpectedDocument.parseIndented(12, `\
            hello world
             ^^^^ 0
          `)),

          "1-paste": new Promise((resolve) => notifyDependents["1-paste"] = resolve),
          "1-paste-select": new Promise((resolve) => notifyDependents["1-paste-select"] = resolve),
        };

  test("transition 1 > 1-paste       ", async function () {
    const beforeDocument = await documents["1"];

    if (beforeDocument === undefined) {
      notifyDependents["1-paste"](undefined);
      this.skip();
    }

    const afterDocument = ExpectedDocument.parseIndented(6, `\
      helloello world
           ^^^^ 0
    `);

    try {
      // Set-up document to be in expected initial state.
      await beforeDocument.apply(editor);

      // Perform all operations.
      await executeCommand("dance.selections.saveText");
      await executeCommand("dance.edit.paste.before");

      // Ensure document is as expected.
      afterDocument.assertEquals(editor);

      // Test passed, allow dependent tests to run.
      notifyDependents["1-paste"](afterDocument);
    } catch (e) {
      notifyDependents["1-paste"](undefined);

      throw e;
    }
  });

  test("transition 1 > 1-paste-select", async function () {
    const beforeDocument = await documents["1"];

    if (beforeDocument === undefined) {
      notifyDependents["1-paste-select"](undefined);
      this.skip();
    }

    const afterDocument = ExpectedDocument.parseIndented(6, `\
      helloello world
       ^^^^ 0
    `);

    try {
      // Set-up document to be in expected initial state.
      await beforeDocument.apply(editor);

      // Perform all operations.
      await executeCommand("dance.edit.paste.before.select");

      // Ensure document is as expected.
      afterDocument.assertEquals(editor);

      // Test passed, allow dependent tests to run.
      notifyDependents["1-paste-select"](afterDocument);
    } catch (e) {
      notifyDependents["1-paste-select"](undefined);

      throw e;
    }
  });
});

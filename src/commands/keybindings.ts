import * as vscode from "vscode";

import type { RegisterOr } from ".";
import { Context, prompt, promptMany, promptOne, todo } from "../api";
import type { Register } from "../state/registers";

/**
 * Utilities for setting up keybindings.
 * | Title                       | Keybinding                                       | Command                                    |
 * | --------------------------- | ------------------------------------------------ | ------------------------------------------ |
 * | Open space menu             | `space` (helix: normal), `space` (helix: select) | `[".openMenu", { menu: "space" }]`         |
 * | Open left bracket menu      | `[` (helix: normal), `[` (helix: select)         | `[".openMenu", { menu: "left_bracket" }]`  |
 * | Open right bracket menu     | `]` (helix: normal), `]` (helix: select)         | `[".openMenu", { menu: "right_bracket" }]` |
 */
declare module "./keybindings";

/**
 * Set up Dance keybindings.
 */
export async function setup(_: Context, register: RegisterOr<"dquote", Register.Flags.CanWrite>) {
  await vscode.commands.executeCommand("workbench.action.openGlobalKeybindingsFile");
  await _.switchToDocument(_.extension.editors.active!.editor.document);

  const action = await promptOne([
    ["y", "yank keybindings to register"],
    ["a", "append keybindings"],
    ["p", "prepend keybindings"],
  ]);

  if (typeof action === "string") {
    return;
  }

  const keybindings = await promptMany([
    ["d", "default keybindings"],
  ]);

  todo();

  // TODO: ask whether remaining keybindings should be ignored.
}

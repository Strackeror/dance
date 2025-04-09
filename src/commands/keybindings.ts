import * as vscode from "vscode";

import type { RegisterOr } from ".";
import { Context, Menu, prompt, promptMany, promptOne, todo } from "../api";
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


/**
 * Add a command to the command menu
 */
export async function addCommand(_: Context) {
  const commands = await vscode.commands.getCommands();
  const command = await vscode.window.showQuickPick(
    commands,
    { title: "Pick the action to create a command for" },
  );
  if (!command) {
    return;
  }

  const name = await vscode.window.showInputBox({ title: "name of the command" });
  if (!name) {
    return;
  }

  const config = vscode.workspace.getConfiguration("dance", vscode.workspace.workspaceFile);
  const menus = config.inspect<Record<string, Menu>>("menus")?.globalValue ?? {};
  if (!menus["command"]) {
    menus["command"] = { items: {} };
  }
  const command_menu = menus["command"];
  command_menu.items[name] = { text: name, command };
  config.update("menus", menus, true);

}
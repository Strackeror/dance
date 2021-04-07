// Auto-generated by src/commands/load-all.build.ts. Do not edit manually.
/* eslint-disable max-len */

import { commands, Context, Direction, Shift } from "../api";
import { Register } from "../register";
import { CommandDescriptor, Commands } from ".";

function getRegister<F extends Register.Flags>(
  _: Context.WithoutActiveEditor,
  argument: { register?: string | Register },
  defaultRegisterName: string,
  requiredFlags: F,
): Register.WithFlags<F> {
  let register: Register = argument.register;
  const extension = _.extensionState;

  if (typeof register === "string") {
    register = extension.registers.get(register);
  } else if (!(register instanceof Register)) {
    register = extension.currentRegister ?? extension.registers.get(defaultRegisterName);
  }

  register.ensureFlags(requiredFlags);

  return (argument.register = register);
}

function getInput(_: Context.WithoutActiveEditor, argument: { input?: any }): any {
  const defaultInput = argument.input;

  if (defaultInput != null) {
    return () => defaultInput;
  }

  return (promptDefaultInput: () => any) => {
    const result = promptDefaultInput();

    if (typeof result.then === "function") {
      return (result as Thenable<any>).then((x) => (argument.input = x));
    }

    return (argument.input = result);
  };
}

function getCount(_: Context.WithoutActiveEditor, argument: { count?: number }) {
  const count = argument.count;

  if (count !== undefined && !isNaN(+count)) {
    return +count;
  }

  return (argument.count = _.extensionState.currentCount);
}

function getRepetitions(_: Context.WithoutActiveEditor, argument: { count?: number }) {
  const count = getCount(_, argument);

  if (count <= 0) {
    return 1;
  }

  return count;
}

function getDirection(argument: { direction?: number | string }) {
  const direction = argument.direction;

  if (direction === undefined) {
    return Direction.Forward;
  }

  if (typeof direction === "number") {
    if (direction === 1 || direction === -1) {
      return direction as Direction;
    }
  } else if (typeof direction === "string") {
    if (direction === "forward") {
      return Direction.Forward;
    }

    if (direction === "backward") {
      return Direction.Backward;
    }
  }

  throw new Error(`direction must be "forward", "backward", 1, -1, or undefined`);
}

function getShift(argument: { shift?: number | string }) {
  const shift = argument.shift;

  if (shift === undefined) {
    return Shift.Select;
  }

  if (typeof shift === "number") {
    if (shift === 0 || shift === 1 || shift === 2) {
      return shift as Shift;
    }
  } else if (typeof shift === "string") {
    if (shift === "jump") {
      return Shift.Jump;
    }

    if (shift === "select") {
      return Shift.Select;
    }

    if (shift === "extend") {
      return Shift.Extend;
    }
  }

  throw new Error(`shift must be "jump", "select", "extend", 0, 1, 2, or undefined`);
}

/**
 * Loads the "edit" module and returns its defined commands.
 */
async function loadEditModule(): Promise<CommandDescriptor[]> {
  const {
    align,
    case_swap,
    case_toLower,
    case_toUpper,
    copyIndentation,
    deindent,
    deindent_withIncomplete,
    indent,
    indent_withEmpty,
    insert,
    join,
    join_select,
    newLine_above,
    newLine_below,
    replaceCharacters,
  } = await import("./edit");

  return [
    new CommandDescriptor(
      "dance.edit.align",
      (_) => _.run((_) => align(_, _.selections)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.case.swap",
      (_) => _.run((_) => case_swap(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.case.toLower",
      (_) => _.run((_) => case_toLower(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.case.toUpper",
      (_) => _.run((_) => case_toUpper(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.copyIndentation",
      (_, argument) => _.run((_) => copyIndentation(_, _.document, _.selections, getCount(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.deindent",
      (_, argument) => _.run((_) => deindent(_, getRepetitions(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.deindent.withIncomplete",
      (_, argument) => _.run((_) => deindent_withIncomplete(_, getRepetitions(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.indent",
      (_, argument) => _.run((_) => indent(_, getRepetitions(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.indent.withEmpty",
      (_, argument) => _.run((_) => indent_withEmpty(_, getRepetitions(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.insert",
      (_, argument) => _.run((_) => insert(_, _.selections, getRegister(_, argument, "dquote", Register.Flags.CanRead), argument.adjust, argument.handleNewLine, argument.select, argument.where)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.join",
      (_, argument) => _.run((_) => join(_, argument.separator)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.join.select",
      (_, argument) => _.run((_) => join_select(_, argument.separator)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.newLine.above",
      (_, argument) => _.run((_) => newLine_above(_, argument.select)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.newLine.below",
      (_, argument) => _.run((_) => newLine_below(_, argument.select)),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.replaceCharacters",
      (_, argument) => _.run((_) => replaceCharacters(_, getRepetitions(_, argument), getInput(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.delete",
      (_) => _.run(() => commands([".edit.insert", { "register": "_" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.delete-insert",
      (_) => _.run(() => commands([".edit.insert", { "register": "_" }], [".modes.set", { "input": "insert" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.newLine.above.insert",
      (_) => _.run(() => commands([".newLine.above", { "select": true }], [".modes.set", { "input": "insert" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.newLine.below.insert",
      (_) => _.run(() => commands([".newLine.below", { "select": true }], [".modes.set", { "input": "insert" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.paste.after",
      (_) => _.run(() => commands([".edit.insert", { "where": "after" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.paste.after.select",
      (_) => _.run(() => commands([".edit.insert", { "where": "after", "select": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.paste.before",
      (_) => _.run(() => commands([".edit.insert", { "where": "before" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.paste.before.select",
      (_) => _.run(() => commands([".edit.insert", { "where": "before", "select": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.selectRegister-insert",
      (_) => _.run(() => commands([".selectRegister"], [".edit.insert"])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.yank-delete",
      (_) => _.run(() => commands([".selections.saveText"], [".edit.insert", { "register": "_" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.yank-delete-insert",
      (_) => _.run(() => commands([".selections.saveText"], [".edit.insert", { "register": "_" }], [".modes.set", { "input": "insert" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.edit.yank-replace",
      (_) => _.run(() => commands([".selections.saveText"], [".edit.insert"])),
      true,
    ),
  ];
}

/**
 * Loads the "history" module and returns its defined commands.
 */
async function loadHistoryModule(): Promise<CommandDescriptor[]> {
  const {
    recording_play,
    recording_start,
    recording_stop,
    repeat,
    repeat_edit,
  } = await import("./history");

  return [
    new CommandDescriptor(
      "dance.history.recording.play",
      (_, argument) => recording_play(getRepetitions(_, argument), getRegister(_, argument, "arobase", Register.Flags.CanReadWriteMacros)),
      false,
    ),
    new CommandDescriptor(
      "dance.history.recording.start",
      (_, argument) => recording_start(getRegister(_, argument, "arobase", Register.Flags.CanReadWriteMacros)),
      false,
    ),
    new CommandDescriptor(
      "dance.history.recording.stop",
      (_, argument) => recording_stop(getRegister(_, argument, "arobase", Register.Flags.CanReadWriteMacros)),
      false,
    ),
    new CommandDescriptor(
      "dance.history.repeat",
      (_, argument) => repeat(getRepetitions(_, argument), argument.include, argument.exclude),
      false,
    ),
    new CommandDescriptor(
      "dance.history.repeat.edit",
      (_, argument) => repeat_edit(getRepetitions(_, argument)),
      false,
    ),
    new CommandDescriptor(
      "dance.history.repeat.objectSelection",
      (_) => _.run(() => commands([".history.repeat", { "include": "dance.selections.object.+" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.history.repeat.selection",
      (_) => _.run(() => commands([".history.repeat", { "include": "dance.selections.+" }])),
      true,
    ),
  ];
}

/**
 * Loads the "menus" module and returns its defined commands.
 */
async function loadMenusModule(): Promise<CommandDescriptor[]> {
  const {
    open,
  } = await import("./menus");

  return [
    new CommandDescriptor(
      "dance.menus.open",
      (_, argument) => open(_, getInput(_, argument), argument.menu, argument.additionalArgs),
      false,
    ),
  ];
}

/**
 * Loads the "misc" module and returns its defined commands.
 */
async function loadMiscModule(): Promise<CommandDescriptor[]> {
  const {
    run,
    selectRegister,
    toggle,
    updateCount,
  } = await import("./misc");

  return [
    new CommandDescriptor(
      "dance.run",
      (_, argument) => run(_, getInput(_, argument), argument.commands),
      true,
    ),
    new CommandDescriptor(
      "dance.selectRegister",
      (_, argument) => _.run((_) => selectRegister(_, getInput(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.toggle",
      (_) => toggle(_.extensionState),
      false,
    ),
    new CommandDescriptor(
      "dance.updateCount",
      (_, argument) => _.run((_) => updateCount(_, _.extensionState, getInput(_, argument), argument.addDigits)),
      true,
    ),
  ];
}

/**
 * Loads the "modes" module and returns its defined commands.
 */
async function loadModesModule(): Promise<CommandDescriptor[]> {
  const {
    set,
    set_temporarily,
  } = await import("./modes");

  return [
    new CommandDescriptor(
      "dance.modes.set",
      (_, argument) => _.run((_) => set(_, getInput(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.modes.set.temporarily",
      (_, argument) => _.run((_) => set_temporarily(_, getInput(_, argument), getRepetitions(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.modes.set.insert",
      (_) => _.run(() => commands([".modes.set", { "input": "insert" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.modes.set.normal",
      (_) => _.run(() => commands([".modes.set", { "input": "normal" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.modes.set.temporarily.insert",
      (_) => _.run(() => commands([".modes.set.temporarily", { "input": "insert" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.modes.set.temporarily.normal",
      (_) => _.run(() => commands([".modes.set.temporarily", { "input": "normal" }])),
      true,
    ),
  ];
}

/**
 * Loads the "search" module and returns its defined commands.
 */
async function loadSearchModule(): Promise<CommandDescriptor[]> {
  const {
    next,
    search,
    selection,
  } = await import("./search");

  return [
    new CommandDescriptor(
      "dance.search.",
      (_, argument) => _.run((_) => search(_, argument.add, getDirection(argument), getInput(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.search.next",
      (_, argument) => next(_.selections, getRegister(_, argument, "slash", Register.Flags.CanRead), getRepetitions(_, argument), argument.add, getDirection(argument)),
      true,
    ),
    new CommandDescriptor(
      "dance.search.selection",
      (_, argument) => selection(argument.smart),
      false,
    ),
    new CommandDescriptor(
      "dance.search.add",
      (_) => _.run(() => commands([".search", { "add": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.search.backward",
      (_) => _.run(() => commands([".search", { "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.search.backward.add",
      (_) => _.run(() => commands([".search", { "direction": -1, "add": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.search.next.add",
      (_) => _.run(() => commands([".search.next", { "add": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.search.previous",
      (_) => _.run(() => commands([".search", { "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.search.previous.add",
      (_) => _.run(() => commands([".search", { "direction": -1, "add": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.search.selection.smart",
      (_) => _.run(() => commands([".search.selection", { "smart": true }])),
      true,
    ),
  ];
}

/**
 * Loads the "seek" module and returns its defined commands.
 */
async function loadSeekModule(): Promise<CommandDescriptor[]> {
  const {
    character,
    wordEnd,
    wordStart,
  } = await import("./seek");

  return [
    new CommandDescriptor(
      "dance.seek.character",
      (_, argument) => _.run((_) => character(_, getInput(_, argument), getRepetitions(_, argument), getDirection(argument), getShift(argument), argument.include)),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordEnd",
      (_, argument) => wordEnd(argument.ws, getShift(argument)),
      false,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart",
      (_, argument) => wordStart(argument.ws, getDirection(argument), getShift(argument)),
      false,
    ),
    new CommandDescriptor(
      "dance.seek.character.backward",
      (_) => _.run(() => commands([".seek.character", { "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.character.extend",
      (_) => _.run(() => commands([".seek.character", { "shift": "extend" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.character.extend.backward",
      (_) => _.run(() => commands([".seek.character", { "shift": "extend", "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.character.included",
      (_) => _.run(() => commands([".seek.character", { "include": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.character.included.backward",
      (_) => _.run(() => commands([".seek.character", { "include": true, "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.character.included.extend",
      (_) => _.run(() => commands([".seek.character", { "include": true, "shift": "extend" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.character.included.extend.backward",
      (_) => _.run(() => commands([".seek.character", { "include": true, "shift": "extend", "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordEnd.extend",
      (_) => _.run(() => commands([".seek.wordEnd", { "shift": "extend" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordEnd.ws",
      (_) => _.run(() => commands([".seek.wordEnd", { "ws": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordEnd.ws.extend",
      (_) => _.run(() => commands([".seek.wordEnd", { "ws": true, "shift": "extend" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.backward",
      (_) => _.run(() => commands([".seek.wordStart", { "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.extend",
      (_) => _.run(() => commands([".seek.wordStart", { "shift": "extend" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.extend.backward",
      (_) => _.run(() => commands([".seek.wordStart", { "shift": "extend", "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.ws",
      (_) => _.run(() => commands([".seek.wordStart", { "ws": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.ws.backward",
      (_) => _.run(() => commands([".seek.wordStart", { "ws": true, "direction": -1 }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.ws.extend",
      (_) => _.run(() => commands([".seek.wordStart", { "ws": true, "shift": "extend" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.seek.wordStart.ws.extend.backward",
      (_) => _.run(() => commands([".seek.wordStart", { "ws": true, "shift": "extend", "direction": -1 }])),
      true,
    ),
  ];
}

/**
 * Loads the "select" module and returns its defined commands.
 */
async function loadSelectModule(): Promise<CommandDescriptor[]> {
  const {
    buffer,
    line,
    line_extend,
    toLine,
    toLineEnd,
    toLineStart,
  } = await import("./select");

  return [
    new CommandDescriptor(
      "dance.select.buffer",
      (_) => _.run((_) => buffer(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.select.line",
      (_, argument) => line(getCount(_, argument), getDirection(argument)),
      false,
    ),
    new CommandDescriptor(
      "dance.select.line.extend",
      (_, argument) => line_extend(getCount(_, argument), getDirection(argument)),
      false,
    ),
    new CommandDescriptor(
      "dance.select.toLine",
      (_, argument) => _.run((_) => toLine(_, getCount(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.select.toLineEnd",
      (_, argument) => toLineEnd(_.document, getCount(_, argument), argument.extend),
      true,
    ),
    new CommandDescriptor(
      "dance.select.toLineStart",
      (_, argument) => toLineStart(_.document, getCount(_, argument), argument.extend),
      true,
    ),
    new CommandDescriptor(
      "dance.select.toLineEnd.extend",
      (_) => _.run(() => commands([".select.toLineEnd", { "extend": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.select.toLineStart.extend",
      (_) => _.run(() => commands([".select.toLineStart", { "extend": true }])),
      true,
    ),
  ];
}

/**
 * Loads the "selections" module and returns its defined commands.
 */
async function loadSelectionsModule(): Promise<CommandDescriptor[]> {
  const {
    extendToLines,
    filter,
    pipe,
    restore,
    restore_withCurrent,
    save,
    saveText,
    split,
    splitLines,
    trimLines,
    trimWhitespace,
  } = await import("./selections");

  return [
    new CommandDescriptor(
      "dance.selections.extendToLines",
      (_) => _.run((_) => extendToLines(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.filter",
      (_, argument) => _.run((_) => filter(_, getInput(_, argument), argument.defaultInput)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.pipe",
      (_, argument) => _.run((_) => pipe(_, getRegister(_, argument, "pipe", Register.Flags.CanWrite), getInput(_, argument))),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.restore",
      (_, argument) => _.run((_) => restore(_, getRegister(_, argument, "caret", Register.Flags.CanReadSelections))),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.restore.withCurrent",
      (_, argument) => _.run((_) => restore_withCurrent(_, _.document, _.cancellationToken, getRegister(_, argument, "caret", Register.Flags.CanReadSelections), argument.reverse)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.save",
      (_, argument) => save(_.document, _.selections, getRegister(_, argument, "caret", Register.Flags.CanReadSelections), argument.style),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.saveText",
      (_, argument) => saveText(_.document, _.selections, getRegister(_, argument, "dquote", Register.Flags.CanWrite)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.split",
      (_) => _.run((_) => split(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.splitLines",
      (_) => _.run((_) => splitLines(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.trimLines",
      (_) => _.run((_) => trimLines(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.trimWhitespace",
      (_) => _.run((_) => trimWhitespace(_)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.filter.regexp",
      (_) => _.run(() => commands([".selections.filter", { "defaultInput": "/" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.pipe.append",
      (_) => _.run(() => commands([".selections.pipe"], [".edit.insert", { "register": "|", "where": "end" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.pipe.prepend",
      (_) => _.run(() => commands([".selections.pipe"], [".edit.insert", { "register": "|", "where": "start" }])),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.pipe.replace",
      (_) => _.run(() => commands([".selections.pipe"], [".edit.insert", { "register": "|" }])),
      true,
    ),
  ];
}

/**
 * Loads the "selections.rotate" module and returns its defined commands.
 */
async function loadSelectionsRotateModule(): Promise<CommandDescriptor[]> {
  const {
    both,
    contents,
    selections,
  } = await import("./selections.rotate");

  return [
    new CommandDescriptor(
      "dance.selections.rotate.both",
      (_, argument) => _.run((_) => both(_, getRepetitions(_, argument), argument.reverse)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.rotate.contents",
      (_, argument) => _.run((_) => contents(_, getRepetitions(_, argument), argument.reverse)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.rotate.selections",
      (_, argument) => _.run((_) => selections(_, getRepetitions(_, argument), argument.reverse)),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.rotate.both.reverse",
      (_) => _.run(() => commands([".selections.rotate", { "reverse": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.rotate.contents.reverse",
      (_) => _.run(() => commands([".selections.rotate.contents", { "reverse": true }])),
      true,
    ),
    new CommandDescriptor(
      "dance.selections.rotate.selections.reverse",
      (_) => _.run(() => commands([".selections.rotate.selections", { "reverse": true }])),
      true,
    ),
  ];
}

/**
 * Loads and returns all defined commands.
 */
export async function loadCommands(): Promise<Commands> {
  const allModules = await Promise.all([
    loadEditModule(),
    loadHistoryModule(),
    loadMenusModule(),
    loadMiscModule(),
    loadModesModule(),
    loadSearchModule(),
    loadSeekModule(),
    loadSelectModule(),
    loadSelectionsModule(),
    loadSelectionsRotateModule(),
  ]);

  return Object.freeze(
    Object.fromEntries(allModules.flat().map((desc) => [desc.identifier, desc])),
  );
}

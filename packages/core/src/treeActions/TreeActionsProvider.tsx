import * as React from 'react';
import {
  TreeChangeActionsContextProps,
  TreeEnvironmentActionsContextProps,
  TreeEnvironmentRef,
  TreeItemIndex, TreeRef,
} from '../types';
import { PropsWithChildren, useImperativeHandle } from 'react';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useCreatedTreeRef } from './useCreatedTreeRef';
import { useTree } from '../tree/Tree';
import { useEnvironmentActions } from '../environmentActions/EnvironmentActionsProvider';

const EnvironmentActionsContext = React.createContext<TreeChangeActionsContextProps>(null as any);
export const useTreeActions = () => React.useContext(EnvironmentActionsContext);

export const TreeActionsProvider = React.forwardRef<TreeRef, PropsWithChildren<{}>>((props, ref) => {
  const environment = useTreeEnvironment();
  const tree = useTree();
  const dnd = useDragAndDrop();
  const envActions = useEnvironmentActions();

  // TODO change tree childs to use actions rather than output events where possible
  const actions: TreeChangeActionsContextProps = {
    abortRenamingItem(): void {
      tree.setRenamingItem(null);
    },
    abortSearch(): void {
      tree.setSearch(null);
    },
    collapseItem(itemId: TreeItemIndex): void {
      envActions.collapseItem(itemId, tree.treeId);
    },
    completeRenamingItem(): void {
      // TODO
    },
    expandItem(itemId: TreeItemIndex): void {
      envActions.expandItem(itemId, tree.treeId);
    },
    focusItem(itemId: TreeItemIndex): void {
      envActions.focusItem(itemId, tree.treeId);
    },
    focusTree(autoFocus: boolean = true): void {
      envActions.focusTree(tree.treeId, autoFocus);
    },
    invokePrimaryAction(itemId: TreeItemIndex): void {
      envActions.invokePrimaryAction(itemId, tree.treeId);
    },
    moveFocusDown(): void {
      envActions.moveFocusDown(tree.treeId);
    },
    moveFocusUp(): void {
      envActions.moveFocusUp(tree.treeId);
    },
    renameItem(itemId: TreeItemIndex, name: string): void {
      envActions.renameItem(itemId, name, tree.treeId);
    },
    selectItems(itemsIds: TreeItemIndex[]): void {
      envActions.selectItems(itemsIds, tree.treeId);
    },
    setSearch(search: string | null): void {
      tree.setSearch(search);
    },
    startRenamingItem(itemId: TreeItemIndex): void {
      tree.setRenamingItem(itemId);
    },
    stopRenamingItem(): void {
      tree.setRenamingItem(null);
    },
    toggleItemExpandedState(itemId: TreeItemIndex): void {
      envActions.toggleItemExpandedState(itemId, tree.treeId);
    },
    toggleItemSelectStatus(itemId: TreeItemIndex): void {
      envActions.toggleItemSelectStatus(itemId, tree.treeId);
    },
  };

  useCreatedTreeRef(ref, actions);

  return (
    <EnvironmentActionsContext.Provider value={actions}>
      { props.children }
    </EnvironmentActionsContext.Provider>
  );
});
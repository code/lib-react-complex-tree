import { TreeItemIndex, TreeProps } from '../types';
import React, { useContext, useMemo, useState } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import {
  createTreeInformation, createTreeInformationDependencies,
  createTreeItemRenderContext,
  createTreeItemRenderContextDependencies,
} from '../helpers';
import { TreeItemChildren } from './TreeItemChildren';
import { TreeConfigurationContext, TreeRenderContext } from './Tree';
import { useViewState } from './useViewState';

export const TreeItem = <T extends any>(props: {
  itemIndex: TreeItemIndex;
  depth: number;
}): JSX.Element => {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  const { treeId } = useContext(TreeConfigurationContext);
  const environment = useContext(TreeEnvironmentContext);
  const viewState = useViewState();
  const renderers = useContext(TreeRenderContext);
  const item = environment.items[props.itemIndex];

  const isExpanded = useMemo(() => viewState.expandedItems?.includes(props.itemIndex), [props.itemIndex, viewState.expandedItems]);
  const renderContext = useMemo(
    () => item && createTreeItemRenderContext(item, environment, treeId),
    createTreeItemRenderContextDependencies(item, environment, treeId)
  );

  const treeInformation = useMemo(
    () => createTreeInformation(environment, treeId),
    createTreeInformationDependencies(environment, treeId),
  ); // TODO Construct in tree instead of every item

  if (item === undefined) {
    if (!hasBeenRequested) {
      setHasBeenRequested(true);
      environment.onMissingItems?.([props.itemIndex]);
    }
    return null as any;
  }

  const children = item.hasChildren && isExpanded && item.children && (
    <TreeItemChildren depth={props.depth + 1} parentId={props.itemIndex} children={item.children} />
  );

  return (renderers.renderItem(environment.items[props.itemIndex], props.depth, children, renderContext, treeInformation) ?? null) as any; // Type to use AllTreeRenderProps
}
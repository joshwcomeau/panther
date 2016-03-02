export function findCenterOfNode(domNode) {
  const box = domNode.getBoundingClientRect();

  return {
    x: Math.round(box.left + (box.width / 2)),
    y: Math.round(box.top + (box.height / 2))
  };
}

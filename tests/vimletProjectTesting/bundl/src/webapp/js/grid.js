function onGridDataChange(filterNode, changeCb, changedCb) {
  util.resetCallback("onFilter", filterNode);
  util.resetCallback("onFiltered", filterNode);

  filterNode.onFilter(function () {
    if(changeCb) {
      changeCb.bind(filterNode)();
    }
  });
  filterNode.onFiltered(function () {
    if(changedCb) {
      changedCb.bind(filterNode)();
    }
  });
}

function isDesktop() {
  return eon.util.isTouchScreen() || window.innerWidth <= 1024 ? false : true
}
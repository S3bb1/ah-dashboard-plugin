define(['app'], function (app) {
  app.run(function ($templateCache) {
    $templateCache.put("template/ah-dashboard.html",
        "<div>\n" +
        "    <div class=\"btn-toolbar\" ng-if=\"!options.hideToolbar\">\n" +
        "        <div class=\"btn-group\" ng-if=\"!options.widgetButtons\">\n" +
        "            <button type=\"button\" class=\"dropdown-toggle btn btn-primary\" data-toggle=\"dropdown\">Add Widget <span\n" +
        "                    class=\"caret\"></span></button>\n" +
        "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
        "                <li ng-repeat=\"widget in widgetDefs\">\n" +
        "                    <a href=\"#\" ng-click=\"addWidgetInternal($event, widget);\"><span class=\"label label-primary\">{{widget.name}}</span></a>\n" +
        "                </li>\n" +
        "            </ul>\n" +
        "        </div>\n" +
        "\n" +
        "        <div class=\"btn-group\" ng-if=\"options.widgetButtons\">\n" +
        "            <button ng-repeat=\"widget in widgetDefs\"\n" +
        "                    ng-click=\"addWidgetInternal($event, widget);\" type=\"button\" class=\"btn btn-primary\">\n" +
        "                {{widget.name}}\n" +
        "            </button>\n" +
        "        </div>\n" +
        "\n" +
        "        <button class=\"btn btn-warning\" ng-click=\"resetWidgetsToDefault()\">Default Widgets</button>\n" +
        "\n" +
        "        <button ng-if=\"options.storage && options.explicitSave\" ng-click=\"options.saveDashboard()\" class=\"btn btn-success\" ng-disabled=\"!options.unsavedChangeCount\">{{ !options.unsavedChangeCount ? \"all saved\" : \"save changes (\" + options.unsavedChangeCount + \")\" }}</button>\n" +
        "\n" +
        "        <button ng-click=\"clear();\" type=\"button\" class=\"btn btn-info\">Clear</button>\n" +
        "    </div>\n" +
        "\n" +
        "    <div ui-sortable=\"sortableOptions\" ng-model=\"widgets\" class=\"dashboard-widget-area\">\n" +
        "        <div ng-repeat=\"widget in widgets\" ng-style=\"widget.style\" class=\"widget-container\" widget>\n" +
        "            <div class=\"widget box box-info\">\n" +
        "                <div class=\"box-header\">\n" +
        "                    <h3 class=\"box-title\">\n" +
        "                        <span class=\"widget-title\" ng-dblclick=\"editTitle(widget)\" ng-hide=\"widget.editingTitle\">{{widget.title}}</span>\n" +
        "                        <form action=\"\" class=\"widget-title\" ng-show=\"widget.editingTitle\" ng-submit=\"saveTitleEdit(widget)\">\n" +
        "                            <input type=\"text\" ng-model=\"widget.title\" class=\"form-control\">\n" +
        "                        </form>\n" +
        "                        <span class=\"label label-primary\" ng-if=\"!options.hideWidgetName\">{{widget.name}}</span>\n" +
        "                    </h3>\n" +
        "                    <div class=\"box-tools pull-right\">" +
        "                      <div ng-click=\"removeWidget(widget);\" class=\"label bg-aqua maploc\"></div>" +
        "                    </div>" +
        "                </div>\n" +
        "                <div class=\"panel-body box-body widget-content\"></div>\n" +
        "                <div class=\"box-footer\">" +
        "                  <a href=\"\" ng-click=\"openWidgetSettings(widget);\">Change Settings</a>" +
        "                </div>" +
        "                <div class=\"widget-ew-resizer\" ng-mousedown=\"grabResizer($event)\"></div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>"
    );
  });
});
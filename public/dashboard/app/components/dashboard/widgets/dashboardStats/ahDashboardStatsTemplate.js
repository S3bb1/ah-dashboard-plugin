define(['app'], function (app) {
  app.run(function ($templateCache) {
    $templateCache.put("template/widget-settings-stats-template.html",
        "<div class=\"modal-header\">\n" +
        "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button>\n" +
        "  <h3>Widget Options for <small>{{widget.title}}</small></h3>\n" +
        "</div>\n" +
        "\n" +
        "<div class=\"modal-body\">\n" +
        "    <form name=\"form\" novalidate class=\"form-horizontal\">\n" +
        "        <div class=\"form-group\">\n" +
        "            <label for=\"widgetTitle\" class=\"col-sm-3 control-label\">Title</label>\n" +
        "            <div class=\"col-sm-9\">\n" +
        "                <input type=\"text\" class=\"form-control\" name=\"widgetTitle\" ng-model=\"result.title\">\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"form-group\">\n" +
        "            <label for=\"widgetStats\" class=\"col-sm-3 control-label\">Stats</label>\n" +
        "            <div class=\"col-sm-9\">\n" +
        "                <div ng-dropdown-multiselect=\"\" options=\"result.statsArr\" selected-model=\"result.attrs.stats\" extra-settings=\"result.dropdownSettings\"></div>" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"form-group\">\n" +
        "            <label for=\"widgetStatsRange\" class=\"col-sm-3 control-label\">Time Range</label>\n" +
        "            <div class=\"col-sm-9\">\n" +
        "                <select class=\"form-control\" ng-model=\"result.attrs.timerange\" name=\"widgetStatsRange\" ng-options=\"range.value as range.label for range in result.ranges\"></select>" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div ng-include=\"optionsTemplateUrl\"></div>\n" +
        "    </form>\n" +
        "</div>\n" +
        "\n" +
        "<div class=\"modal-footer\">\n" +
        "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
        "    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
        "</div>"
    );
  });
});
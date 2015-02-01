define(['app'], function (app) {
  app.service('ahDashboardSession', function () {
    this.create = function (email, sessionId) {
      this.id = sessionId;
      this.email = email;
    };
    this.destroy = function () {
      this.id = null;
      this.email = null;
    };
    this.authChecking = true;
    return this;
  })
});
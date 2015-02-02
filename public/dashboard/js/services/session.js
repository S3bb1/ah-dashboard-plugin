define(['app'], function (app) {
  app.service('ahDashboardSession', function () {
    this.create = function (username, firstName, lastName, email, sessionId) {
      this.id = sessionId;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.username = username;
    };
    this.destroy = function () {
      this.id = null;
      this.email = null;
      this.firstName = null;
      this.lastName = null;
      this.username = null;
    };
    this.authChecking = true;
    return this;
  });
});
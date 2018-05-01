AuditLog = new Mongo.Collection("auditlog");
AuditLog.allow({
  insert: function(userId, doc) { return true; },
  update: function(userId, doc, fieldNames, modifier) { return false; },
  remove: function(userId) { return false; }
});
Meteor.methods({
  AuditDoc: function(collection, action, doc, old) {
    if (Meteor.isServer) {
      var r = AuditLog.getDiffOldNew(old || {}, doc);
      var username = Meteor.user().profile.name;
    } else {
      var r = [ {"kind":"D","path":["*"],"lhs":doc} ];
      var username = 'SYSTEM';
    }
    AuditLog.insert({
      userId: Meteor.userId(),
      username: username,
      docId: doc._id || undefined,
      action: action,
      collection: collection,
      result: r
    });
  },
  AuditLog: function(obj) {
    obj.userId = Meteor.userId();
    obj.username = username;
    AuditLog.insert(obj);
  }
});


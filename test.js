var assert = require('assert'),
    connect = require('connect'),
    Couch = require('./lib/couch'),
    ConnectCouchDB = require('./')(connect);

var store = new ConnectCouchDB({ name: 'connect-couch-test' }, function() {
  // #set()
  store.set('123', { cookie: { maxAge: 2000 }, name: 'tj' }, function(err, ok){
    assert.ok(!err, '#set() got an error');
    
    // #get()
    store.get('123', function(err, data){
      assert.ok(!err, '#get() got an error');
      assert.deepEqual({ cookie: { maxAge: 2000 }, name: 'tj' }, data);

      // #length()
      store.length(function(err, len){
        assert.ok(!err, '#length() got an error');
        assert.equal(1, len, '#length() with keys');

        // #clear()
        store.clear(function(err, ok){
          assert.ok(!err, '#clear()');

          // #length()
          store.length(function(err, len){
            assert.ok(!err, '#length()');
            assert.equal(0, len, '#length() without keys');

            // #set null
            store.set('123', { cookie: { maxAge: 2000 }, name: 'tj' }, function(){
              store.destroy('123', function(){
                store.length(function(err, len){
                  assert.equal(0, len, '#set() null');
                  store.db.dbDel(function() {
                    console.log('done');
                    process.exit()
                  });
                });
              });
            });
          });
        });
      });
    })
  });
});
var should = require('should');

var GoogleMapsAPI = require('../../lib/index');


describe('constructor', function() {

  describe('defaults', function() {

    it('should default config if none is passed', function() {
      (function() { new GoogleMapsAPI() }).should.not.throw();
      var gmAPI = new GoogleMapsAPI();
      should.exist( gmAPI.config );
    });

    it('should default request if none is passed', function() {
      var validConfig = {};
      (function() { new GoogleMapsAPI( validConfig ) }).should.not.throw();
      var gmAPI = new GoogleMapsAPI( validConfig );
      should.exist( gmAPI.request );
      gmAPI.request.should.be.instanceof(Function);
    });

    var invalidRequest = [false, 0, NaN, '', {}, [], new Object, new Date];
    var calls = invalidRequest.map(
      function(invalid) {
        return function() {
          it('should default request if ' + invalid + ' is passed', function() {
            var validConfig = {};
            (function() { new GoogleMapsAPI( validConfig, invalid ) }).should.not.throw();
            var gmAPI = new GoogleMapsAPI( validConfig, invalid )
            should.exist( gmAPI.request );
            gmAPI.request.should.be.instanceof(Function);
          });
        } 
      }
    );

    calls.forEach( function(checkCall) {
      checkCall();
    });

  });

  describe('success', function() {

    it('should accept configurations', function() {

      var config = {
        'key':                'xxxxxxxxxxxxxxxx',
        'google-client-id':   'test-client-id',
        'stagger-time':       1000,
        'encode-polylines':   false,
        'secure':             true,
        'proxy':              'http://127.0.0.1:9999',
        'google-private-key': 'test-private-key'
      };

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );

      gmAPI.config['key'].should.equal( config['key'] );
      gmAPI.config['google-client-id'].should.equal( config['google-client-id'] );
      gmAPI.config['stagger-time'].should.equal( config['stagger-time'] );
      gmAPI.config['encode-polylines'].should.equal( config['encode-polylines'] );
      gmAPI.config['secure'].should.equal( config['secure'] );
      gmAPI.config['proxy'].should.equal( config['proxy'] );
      
      should.exist( gmAPI.config['google-private-key'] );

    });

    it('should accept any injected request function', function() {

      var customRequest = function(options, callback){
        return callback(null, {}, "{}");
      };

      var gmAPI = new GoogleMapsAPI( {}, customRequest );

      should.exist( gmAPI.request );

      gmAPI.request.should.eql( customRequest );

    });

  });

  describe('configurations logic', function() {

    it('should not set arbitrary configuration keys', function() {

      var config = {
        'some-random-unaccepted-key': '##'
      };

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );
      gmAPI.config.should.not.have.property( 'some-random-unaccepted-key' );

    });

    it('should base64 encode google-private-key after normalizing', function() {

      var config = {
        'google-private-key': 'test-private_key'
      };

      var normalizedGooglePrivateKey = 'test+private/key';

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );

      gmAPI.config['google-private-key'].should.be.instanceof( Buffer );
      gmAPI.config['google-private-key'].should.eql( new Buffer( normalizedGooglePrivateKey, 'base64' ) );

    });

  });

  describe('non global object', function() {

    it('should not return a singleton', function() {

      var config = {
        'google-private-key': 'test-private_key'
      };

      var gmAPI_1 = new GoogleMapsAPI( config );

      var config = {
        'key': 'xxxxxxx',
        'google-client-id':   'test-client-id',
        'stagger-time':       1000,
        'encode-polylines':   false,
        'secure':             true,
        'proxy':              'http://127.0.0.1:9999',
        'google-private-key': 'test-private-key'
      };

      var gmAPI_2 = new GoogleMapsAPI( config );

      gmAPI_1.config.should.not.eql( gmAPI_2.config );

    });

  });

});

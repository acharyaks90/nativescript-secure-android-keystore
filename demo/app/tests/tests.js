var SecureAndroidKeystore = require("nativescript-secure-android-keystore").SecureAndroidKeystore;
var secureAndroidKeystore = new SecureAndroidKeystore();

describe("greet function", function() {
    it("exists", function() {
        expect(secureAndroidKeystore.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(secureAndroidKeystore.greet()).toEqual("Hello, NS");
    });
});

/*jshint unused: false, curly: false */
var AWShelper = (function($,M,w) {
  var ACCESS_KEY_ID = "...",
      SECRET_KEY = "...",
      thedate = false,
      dateTimeISO = false,
      stringToSign = "",
      canRequest  = "",
      thefile = "",
      filebin = "",
      signatureKey = "",
      signature = "",
      init =function(){
        setCredentials();
        setthedate();
        setDateTimeISO();
        console.log(thedate);
      },
      setCredentials = function(bin){
        //DO NOT USE IN PRODUCTION...TODO: Figure out another mechanism to retrieve
        filebin = bin;
        console.log(filebin);
        ACCESS_KEY_ID = "AKIAIPIDYUEDIQNWK4TA";
        SECRET_KEY = "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";
      },
     amzCredential=function(){
       console.log(ACCESS_KEY_ID);
       return ACCESS_KEY_ID + '/'+ getthedate() + '/us-east-1/s3/aws4_request';
     },
     dateRegionService = function(){
       return getthedate() + "/us-east-1/s3/aws4_request";
     },
     getStringToSign=function(){
        return (stringToSign !== '') ?  stringToSign : "AWS4-HMAC-SHA256\n" + getDateTimeISO()+"\n" + dateRegionService()+"\n" + HexHMAC(getCanonicalRequest())+"\n";
     },
     getCanonicalRequest = function(){
       if(canRequest !== "") return canRequest;
       var canURI = '/';
       var canQueryString = '';
       var canHeaders = makeCanHeaders({"host":"concierge-attachments.s3.amazonaws.com","x-amz-date":dateTimeISO});
       var signedHeaders = "host;x-amz-date"; console.log(thefile);
       var payload = HexHMAC(filebin);
       return "POST\n" + canURI + '\n' + canQueryString + '\n' + canHeaders + '\n' + signedHeaders + '\n' + payload;
     },
     getSignatureKey=function(){
       if(signatureKey !== '') return signatureKey;
        var kDate    = crypt(getthedate(), "AWS4" + SECRET_KEY);//CryptoJS.HmacSHA256(getthedate(), "AWS4" + SECRET_KEY, { asBytes: true});
        var kRegion  = crypt('us-east-1', kDate);
        var kService = crypt("s3", kRegion);
        var kSigning = crypt("aws4_request", kService);
        return kSigning;
     },
     getSignature = function(){
       if(signature !== "") return signature;
       return HexHMAC(getSignatureKey(),getStringToSign());
     },
     setDateTimeISO = function(){
       dateTimeISO =  M().format("YYYYMMDDTHHMMSS")+'Z';
     },
     setthedate = function(){
        thedate = M().format('YMMDD');
     },
     getthedate = function(){
       if(typeof thedate === false) setthedate();
       //console.log(M().format('YMMDD'));
       return thedate;
     },
     getDateTimeISO = function(){
       if(typeof dateTimeISO === false) setDateTimeISO();
       return dateTimeISO;
     },
     crypt = function(){
       //console.log(arguments);
       var args = [];
       if (arguments.length === 1){
         args.push(CryptoJS.SHA256(arguments[0]).toString());
         args.push('file');
         //console.log(args);
      }else{
        args = $.map(arguments,function(i,v){
           return CryptoJS.SHA256(i).toString();
         });
      } // ? true : false;

       //if(isFile) args = [args];
       console.log(args);

       //if(!$.isArray(args)) args = [args];
       args.push({asBytes:true});
       return CryptoJS.HmacSHA256.apply(null, args);
     },
     HexHMAC = function(value){
       return CryptoJS.enc.Hex.stringify(crypt(value));
     },
     getAuthorizationHeader = function(){
       var auth = "AWS4-HMAC-SHA256 Credential=";
       auth+= ACCESS_KEY_ID +"/" + dateRegionService() + ", ";
       auth+= "SignedHeaders=content-type;host;x-amz-date, ";
       auth+= "Signature=" + getSignature();
       return auth;
     },
     makeCanHeaders = function(headers){
       var can ="";
       $.each(headers,function(name,value){
         can+= cannonize(name,value);
       });
       return can;
     },
     cannonize = function(name,value){
       return name.toLowerCase() + ":" + $.trim(value) + "\n";
     },
     getHeaders =function(bin,file,filename){
       filebin = bin;
       thefile = file;
       var headers = {
         "key" : getKeyHeader(filename),
         //"SuccessActionStatus" : "201",
         "X-Amz-Algorithm" : "AWS4-HMAC-SHA256",
         "X-Amz-Credential" : amzCredential(),
         "X-Amz-Date": dateTimeISO,
         //"AWSAccessKeyId": ACCESS_KEY_ID,
         "X-Amz-Signature": getSignature(),
         "content-type":"application/x-www-form-urlencoded; charset=utf-8",
         "x-amz-content-SHA256": HexHMAC(filebin),
         //"file":thefile,
         "Authorization":getAuthorizationHeader()
       };
       return headers;
     },
     getKeyHeader = function(fname){
       return "/concierge-cms/"+fname;
     },
     toBin = function(file){
       console.log(file);
       var reader = new FileReader();
              var bin;
       reader.onload = function(e) {
        //bin = reader.result;
       }
       //reader.readAsBinaryString(file);
       console.log(reader.readAsBinaryString(file));
       console.log(reader.result);
       /*var sha256 = CryptoJS.algo.SHA256.create();
       var reader = new FileReader();
       var hash;
       // If we use onloadend, we need to check the readyState.
       reader.onloadend = function(evt) {
         if (evt.target.readyState === FileReader.DONE) { // DONE == 2
           //**UPDATED SOLUTION: Since its binary data, the message needs to be converted from string to bytes using Latin1**
              sha256.update(CryptoJS.enc.Latin1.parse(evt.target.result));
              hash = sha256.finalize();
         }
       };*/
     };

    return {
      init:init,
      getHeaders : getHeaders
    };
})(jQuery,moment,window);

var movieSearch = {
  version: '1.0.0'
  ,appInit: function(){
    this.runApp();
  }
  ,app: { }
  ,runApp: function(){
    

    var _this = this;
    $(document).ready(function(){

      //search button is clicked
      $('#search').on('click',function(){
        if($('#searchTerm').val().length>0){ //if searchTerm
          _this.clearSelected();
          //get and encode term
          var s = _this.getTerm('searchTerm');
          
          //make itunes api post
          var a = _this.apiCall(s); 

        }
      });

      //Enter key is pressed for search
      $("#searchTerm").keydown(function(e){
          if(e.which === 13){
              $("#search").click();
              _this.clearSelected();
          }
      });    

      //Slide Click
      $(document.body).on('click', '.showcase-item' ,function(){
        var titleId =$(this).attr('data-info');
        var selectRes = _this.getResults('localResults',titleId);
        _this.displaySelected(selectRes);

      });  

      //Add to Shopify
      $('#addToShopify').on('click',function(){
            _this.apiAddProduct($(this).attr('data-movie'));
            $('.shopify-status').html('saving...');
      });

    });
    
  }
  ,dataShopify: function(data){
  
    var coverProd = data.coverProd.replace(/\//g,'\\/');
    var format = {
        "product": {
            "title": data.title,
            "body_html": data.description,
            "vendor": "Instant Movie Codes",
            "product_type": "iTunes Movie Code",
            "tags": data.genre,
            "image": {
              "src": data.coverProd
            },
            "metas": [
              {
                "key": "description",
                "value": data.description,
                "value_type": "string",
                "namespace": "product_custom"
              },
              {
                "key": "genre",
                "value": data.genre,
                "value_type": "string",
                "namespace": "product_custom"
              },
              {
                "key": "advisory",
                "value": data.advisory,
                "value_type": "string",
                "namespace": "product_custom"
              },
              {
                "key": "trailer",
                "value": data.iTunePreview,
                "value_type": "string",
                "namespace": "product_custom"
              } 
            ],             
            "variants": [
            {
              //id: 7427381637,
              //product_id: 2550512645,
              title: "Default Title",
              price: 1.99,
              sku: "ITUNES-"+data.title,
              inventory_policy: "deny",
              compare_at_price: "0.00",
              fulfillment_service: "manual",
              inventory_management: "shopify",
              option1: "Default Title",
              requires_shipping: false,
              taxable: false,
              inventory_quantity: 0
              }
            ]

            
        }
    }

   

    return JSON.stringify(format);

  }
  ,apiAddProduct: function(postData){

    //fPostData = {"product":{"title":"Test another idiot"}};
    //postData = {"product":{"title":"2 Guns","body_html":"Academy Award® winner Denzel Washington and Mark Wahlberg lead an all-star cast in the explosive action hit 2 Guns. When an attempt to take down a drug cartel blows up in their faces, two undercover operatives are forced to go on the run together, though neither knows that the other is a federal agent. Suddenly, everyone on both sides of the law wants them dead, and their only hope is to trust each other. Filled with non-stop action and suspense, critics are raving “Washington and Wahlberg are at their very best.” – Pete Hammond, Movieline","vendor":"Instant Movie Codes","product_type":"iTunes Movie Code","image":{"src":"http://is3.mzstatic.com/image/thumb/Video6/v4/4d/a1/9f/4da19f64-f0d7-8610-d14a-3fdf4607d9b8/source/600x600bb.jpg"},"metafields":[{"key":"description","value":"Academy Award® winner Denzel Washington and Mark Wahlberg lead an all-star cast in the explosive action hit 2 Guns. When an attempt to take down a drug cartel blows up in their faces, two undercover operatives are forced to go on the run together, though neither knows that the other is a federal agent. Suddenly, everyone on both sides of the law wants them dead, and their only hope is to trust each other. Filled with non-stop action and suspense, critics are raving Washington and Wahlberg are at their very best. – Pete Hammond, Movieline","value_type":"string","namespace":"product_custom"},{"key":"genre","value":"Action & Adventure","value_type":"string","namespace":"product_custom"},{"key":"advisory","value":"R","value_type":"string","namespace":"product_custom"},{"key":"trailer","value":"http://a276.phobos.apple.com/us/r1000/029/Video4/v4/ec/29/b8/ec29b81b-ab7e-4abb-4431-9d662e0d5182/mzvf_648243695183894372.640x354.h264lc.D2.p.m4v","value_type":"string","namespace":"product_custom"}]}};
    var _this = this;
    var postUrl = 'http://deliver.instantmoviecodes.com/proxy/shopifyProductAdd';
    //var postUrl = 'http://dl.uvgrab.com/proxy/shopifyProductAdd';
    $.ajax({ 
        type: 'POST', 
        url: postUrl, 
        data: postData, 
        datatype : "application/json",
        crossDomain: true,
        success: function (data) {
          var p = JSON.parse(data);
          console.log(p.product.id);

          //tell status it's done
          $('.shopify-status').html('saved. '+p.product.updated_at);
          $('.shopify-link-added').html('<a href="https://instant-movie-codes.myshopify.com/admin/products/' + p.product.id + '" target="_blank">'+p.product.title+'</a>');
        }
    });    

  }
  ,apiCall: function(movieName){
    
    var _this = this;
    $.ajax({ 
        type: 'GET', 
        url: 'https://itunes.apple.com/search', 
        data: { term: movieName, entity: 'movie' }, 
        dataType: 'jsonp',
        jsonCallback: 'callback',
        success: function (data) { 
           var res = JSON.stringify(data);
           var jData = JSON.parse(res); 
          //debug
           console.log(jData);
           
           var rCnt = data.resultCount;           
           var sessionResults = [];
            //Start interation of elements in results
            $(data.results).each(function(index, el) { //go through data

              var release = data.results[index].releaseDate;
              if(release.indexOf('2012') != -1 || release.indexOf('2013') != -1 || release.indexOf('2014') != -1 || release.indexOf('2015') != -1 || release.indexOf('2016') != -1){//if it is recent

                
                if(typeof data.results[index].trackName !== 'undefined'){
                  var title       = data.results[index].trackName;
                } else {
                  var title       = data.results[index].collectionName;
                }
                var cover       = data.results[index].artworkUrl100;
                var coverTn     = cover.replace('100x100bb.jpg','300x300bb.jpg');
                var coverProd   = cover.replace('100x100bb.jpg','600x600bb.jpg');
                var description = data.results[index].longDescription;
                var advisory    = data.results[index].contentAdvisoryRating;
                var genre       = data.results[index].primaryGenreName;
                var hdPrice     = data.results[index].trackHdPrice;
                var tubeTrailer = 'https://www.youtube.com/results?search_query='+ movieName.replace(/ /g,'+') +'+trailer';

                var releaseDate = data.results[index].releaseDate;
                var iTunePreview= data.results[index].previewUrl; //this is not found on tvSeries entity.

                sessionResults.push({"title": title.replace(/'/g,"\\'"),
                                      "cover": cover,
                                      'coverTn': coverTn,
                                      'coverProd': coverProd,
                                      'description': description.replace(/'/g,""),
                                      'advisory': advisory,
                                      'genre': genre,
                                      'hdPrice': hdPrice,
                                      'tubeTrailer': tubeTrailer,
                                      'iTunePreview': iTunePreview,
                                      'releaseDate': releaseDate
                                    });
                console.log(iTunePreview);


              } else { //is NOT recent
                rCnt = rCnt - 1;

                //console.log(index + ' | no -' + data.results[index].trackName);

              }

            });

            _this.setupResults(sessionResults);
            //save results to localSession
            _this.saveResults('localResults',sessionResults);
            //set result count after manip
            $('#resultsCount').html(rCnt);
          
           
        }
    });

  }
  ,clearSelected: function(){
    $('#results-info-pane').hide();
  }
  ,displaySelected: function(data){
    $('#results-info-pane').show();
    $('#selected-title').html(data.title);
    $('#selected-release-date').html(data.releaseDate);
    $('#selected-description').html(data.description);
    $('#selected-cover').attr('href',data.coverProd);
    $('#selected-trailer').attr('href',data.tubeTrailer);

    $('#selected-advisory').html(data.advisory);
    $('#selected-price').html(data.hdPrice);
    $('#selected-genre').html(data.genre);

    var shopData = this.dataShopify(data);
    $('#addToShopify').attr('data-movie',shopData);

    console.log(shopData);


  }
  ,saveResults: function(key,session){
    // Save data to sessionStorage
    sessionStorage.setItem(key, JSON.stringify(session));
   
  }
  ,getResults: function(key, idx){
    var t = sessionStorage.getItem(key);
    var rData = JSON.parse(t);
    console.log(rData[idx]); 
    return rData[idx];   
  }
  ,setupResults: function(session){
    //convert session objects into slick slide

    if($('#title-slide').html() != ""){
      $('#title-slide').slick('slickRemove', null, null, true);
    } else {
      this.setSlick();
    }
    
    $(session).each(function(index, el) {
      var sHt = '<div><div class="showcase-item text-xs-center" data-info="'+ index +'"><img src="'+ el.coverTn +'"/></div></div>';      
      $('#title-slide').slick("slickAdd",sHt);   
    });
 
    
  }
  ,getTerm: function(termId){
      var searchTerm = $('#'+termId).val();
      //searchTerm = this.encodeTerm(searchTerm);
      //searchTerm = searchTerm.replace('%20','+');
      return searchTerm;
  }
  ,encodeTerm: function(term){
    return encodeURI(term);
  }
  ,setSlick: function(){

      $('#title-slide').slick({
        centerMode: true,
        centerPadding: '20px',
        arrows: true,
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 4,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });    
  }
  
};

movieSearch.settings        = {};


$(window).bind("load", function() {
  console.log('started...');
   movieSearch.appInit();
});



module.exports = function(grunt) {





	// Load the plugins
	//load-grunt-tasks instead of grunt.loadNpmTasks('grunt-contrib-concat');
	//https://www.npmjs.com/package/load-grunt-tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		,cfg: {
			appBase: 'app'
			,distBase: 'dist'
			,vendorBase: 'vendor'
			,appTemplate: 'template.htm'
			,appMain: 'app.htm'
			,distMain: 'app.htm'
			,banner: '/*!\n' +
			      ' * <%= pkg.name %>\n' +			      
			      ' * <%= pkg.repository.url %>\n' +
			      ' * @author <%= pkg.author %>\n' +
			      ' * @version <%= pkg.version %>\n' +
			      ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
			      ' */\n'
			,sassBase: 'sass/'
			,sassSrc: 'sass/main.scss'
			,appCss: 'app-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMM") %>.css'
			,appJs: 'app-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMM") %>.js'
			,appVendorJs: 'app-vendor-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMM") %>.js'
			,distCss: 'app-min-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMM") %>.css'
			,distJs: 'app-min-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMM") %>.js'
			,distJsUglify: 'app-ug-<%= pkg.version %>-<%= grunt.template.today("yyyymmdd-hMM") %>.js'
			,faFlag: 0      		
		}
	    ,replace: {
	      dist: {
	      	src: ['<%= cfg.appBase %>/<%= cfg.appTemplate %>']
	        ,dest: ['<%= cfg.distBase %>/<%= cfg.distMain %>']	        
	        //,overwrite: true
	        ,replacements: [
		        {
					from: '{{ appjs }}'
					,to: '<%= cfg.distJs %>'
		        }
		        ,{
		        	from: '{{ vendorjs }}'
		        	,to: '<%= cfg.appVendorJs %>'
		        }
		        ,{
		        	from: '{{ appcss }}'
		        	,to: '<%= cfg.distCss %>'
		        }
	        ]
	      }
	      ,dev: {
	      	src: ['<%= cfg.appBase %>/<%= cfg.appTemplate %>']
	        ,dest: ['<%= cfg.appBase %>/<%= cfg.appMain %>']	        
	        //,overwrite: true
	        ,replacements: [
		        {
					from: '{{ appjs }}'
					,to: '<%= cfg.appJs %>'
		        }		        
		        ,{
		        	from: '{{ appcss }}'
		        	,to: '<%= cfg.appCss %>'
		        }
	        ]
	      }	      
	    }
	    ,concat: {
	      options: {
	          separator: ';'
	          ,banner: '/* <%=pkg.name %>-<%=pkg.version %> */'
	      }
	      ,dist: {
	          src: [
	            '<%= cfg.appBase %>/js/*.js'
	          ]
	          ,dest: '<%= cfg.distBase %>/<%= cfg.distJs %>'
	      }
	      ,distVendor: {
	      		src: [
	      			
		          	'<%= cfg.vendorBase %>'+'/jquery/dist/jquery.min.js',
		          	'<%= cfg.vendorBase %>'+'/bootstrap/dist/js/bootstrap.min.js',
					//'<%= cfg.vendorBase %>'+'/slick-carousel/slick/slick.js'		          		      			
	      		]
	      		,dest: '<%= cfg.distBase %>/<%= cfg.appVendorJs %>'
	      }
	      ,dev: {
	          src: [
	          	
	          	'<%= cfg.vendorBase %>'+'/jquery/dist/jquery.min.js',	
	          	'<%= cfg.appBase %>/js/*.js',          	
	          	'<%= cfg.vendorBase %>'+'/bootstrap/dist/js/bootstrap.js'
	            
	          ]
	          ,dest: '<%= cfg.appBase %>/<%= cfg.appJs %>'
	      } 	           
	    }//Concat
		,sass: {
		  dist: {        
		    options: {
		      style: 'compressed'
		      ,lineNumbers: true
		    } 
		    ,files: {
		      '<%= cfg.distBase %>/<%= cfg.distCss %>' : '<%= cfg.appBase %>/<%= cfg.sassSrc %>'
		    }       
		  },
		  dev: {
		    options: {
		      //style: 'compressed'
		    } 
		    ,files: {
		      '<%= cfg.appBase %>/<%= cfg.appCss %>' : '<%= cfg.appBase %>/<%= cfg.sassSrc %>'
		    }         
		  }
		     
		}
		/** not used
		,copy: {
		  dist: {
		      files: [
		          { //root htm file (template)
		            expand: true
		            ,cwd: '<%= cfg.appBase %>/'
		            ,src: ['<%= cfg.appMain %>']
		            ,dest: '<%= cfg.distBase %>/'
		            ,flatten: true
		            ,filter: 'isFile'
		          }
		      ]
		  }		  
		}
		*/			    	    		
		,uglify: {
		  
		    dist : {
				options: {
				  mangle: true				  
				  ,footer: ''
				}		    	
				,files : {
					'<%= cfg.distBase %>/<%= cfg.distJsUglify %>' : ['<%= cfg.distBase %>/<%= cfg.distJs %>']
				}
		    }
		  
		}
	    ,clean: {
	      dist: ['dist']
	      ,dev: ['<%= cfg.appBase %>/*.js','<%= cfg.appBase %>/*.css','<%= cfg.appBase %>/*.map','<%= cfg.appMain %>']
	    }

		,watch: {
			app: {
			  files: [
			  			'<%= cfg.appBase %>/js/*.js'
			  			,'<%= cfg.appBase %>/<%= cfg.sassBase %>/*.scss'
			  			//,'<%= cfg.appBase %>/<%= cfg.sassSrc %>'
			  			//, '<%= cfg.appBase %>/*.htm'
			  			, '<%= cfg.appBase %>/<%= cfg.appTemplate %>'
			  		]
			  ,tasks: ['watch-dev']
			  ,options: {
			  	livereload: true
			  }

			}
		}
		,connect: {
		  server: {
		    options: {
		      livereload: true,
		      base: {
		      			path: '<%= cfg.appBase %>',
		  				options: {
		  					index: '<%= cfg.appMain %>'
		  				}
		  			}
		      ,port: 9009
			  ,open: 
				{
				  target: 'http://localhost:9009/<%= cfg.appMain %>', // target url to open 
				  appName: 'Google Chrome', // name of the app that opens, ie: open, start, xdg-open 
				  callback: function() {} // called when the app has opened 
				}	    	
			   		      
		    }
		  },
		  dist: {
		    options: {
		    	keepalive: true,
		      livereload: true,
		      base: {
		      			path: '<%= cfg.distBase %>',
		  				options: {
		  					index: '<%= cfg.distMain %>'
		  				}
		  			}
		      ,port: 9009
			  ,open: 
				{
				  target: 'http://localhost:9009/<%= cfg.distMain %>', // target url to open 
				  appName: 'Google Chrome', // name of the app that opens, ie: open, start, xdg-open 
				  callback: function() {} // called when the app has opened 
				}	    	
			   		      
		    }
		  }		  
		}			      		 

	});

	// Default task(s).
	grunt.registerTask('dev', ['clean:dev','concat:dev','sass:dev','replace:dev','connect:server','watch']);
	
	grunt.registerTask('dist', ['clean:dist','concat:dist','concat:distVendor','uglify:dist','sass:dist','replace:dist','connect:dist']);	

	grunt.registerTask('watch-dev', ['clean:dev','concat:dev','sass:dev','replace:dev']); 
	grunt.registerTask('play', function(jq, fa) {
		var j = (typeof jq !== 'undefined')?jq:0;
		var f = (typeof fa !== 'undefined')?fa:0;
   		console.log(j); 
   		console.log(f);

	}); 

};
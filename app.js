class SQLMapGenerator {
    constructor() {
        this.config = {};

        this.paramMapping = {
            '-u': 'url',
            '-d': 'directDb',
            '-g': 'googleDork',
            '-m': 'targetsFile',
            '-l': 'burpFile',
            '--scope': 'burpFileScope',

            '--timeout': 'timeout',
            '--delay': 'delay',
            '--threads': 'threads',
            '--force-ssl': 'forceSsl',
            '--keep-alive': 'keepAlive',
            '--null-connection': 'nullConnection',
            '--http2': 'http2',

            '--proxy': 'proxy',
            '--proxy-cred': 'proxyCred',
            '--proxy-file': 'proxyFile',
            '--proxy-freq': 'proxyFreq',
            '--ignore-proxy': 'proxyIgnore',
            '--tor': 'tor',
            '--check-tor': 'checkTor',
            '--tor-port': 'torPort',
            '--tor-type': 'torType',

            '--method': 'method',
            '--param-del': 'paramDel',
            '-r': 'requestFile',
            '--data': 'data',
            
            '--host': 'host',
            '-A': 'userAgent',
            '--random-agent': 'userAgent',
            '--mobile': 'mobileUserAgent',
            '--referer': 'referer',
            '-H': 'headers',

            '--cookie': 'cookie',
            '--cookie-del': 'cookieDel',
            '--live-cookies': 'cookieLive',
            '--load-cookies': 'cookieLoad',
            '--drop-set-cookie': 'cookieDrop',
            '--auth-type': 'authType',
            '--auth-cred': 'authCred',
            '--auth-file': 'authFile',

            '--csrf-token': 'csrfToken',
            '--csrf-method': 'csrfMethod',
            '--csrf-url': 'csrfUrl',
            '--csrf-retries': 'csrfRetries',
            
            '-p': 'paramTest',
            '--skip': 'paramSkip',
            '--param-exclude': 'paramExclude',
            '--param-filter': 'paramFilter',
            '--prefix': 'prefix',
            '--suffix': 'suffix',
            
            '--string': 'string',
            '--regexp': 'regexp',
            '--not-string': 'notString',
            '--code': 'code',
            '--titles': 'titles',
            '--text-only': 'textOnly',
            '--level': 'level',

            '--risk': 'risk',
            '--dbms': 'dbms',
            '--os': 'os',
            '--second-url': 'secondUrl',
            '--second-req': 'secondReq',
            '--technique': 'technique',
            '--invalid-bignum': 'invalidBignum',
            '--invalid-logical': 'invalidLogical', 
            '--invalid-string': 'invalidString',
            '--no-cast': 'noCast',
            '--no-escape': 'noEscape',
            '--predict-output':'predictOutput',

            '--all': 'all',
            '--banner': 'banner',
            '--columns': 'columns',
            '--comments': 'comments',
            '--count': 'count',
            '--current-user': 'currentUser',
            '--current-db': 'currentDb',
            '--dbs': 'dbs',
            '--dump': 'dump',
            '--dump-all': 'dumpAll',
            '--exclude-sysdbs': 'excludeSysdbs',
            '--hostname': 'hostname',
            '--is-dba': 'isDba',
            '--passwords': 'passwords',
            '--privileges': 'privileges',
            '--roles': 'roles',
            '--schema': 'schema',
            '--search': 'search',
            '--statements': 'statements',
            '--tables': 'tables',
            '--users': 'users',
            
            '-D': 'database',
            '-T': 'table',
            '-C': 'column',
            '-X': 'exclude',
            '-U': 'user',
            '--pivot-column': 'pivotColumn',
            '--where': 'where',
            '--start': 'start',
            '--stop': 'stop',
            '--first': 'first',
            '--last': 'last',
            '--sql-query': 'sqlQuery',
            '--sql-file': 'sqlFile',

            '--tamper': 'tamper',

            '-v': 'verbose',
            '-t': 'trafficFile',
            '-c': 'configFile',
            '--batch': 'batch',
            '--parse-errors': 'parseErrors'
        };

        this.tamperScriptList = [
            "0eunion",
            "apostrophemask",
            "apostrophenullencode",
            "appendnullbyte",
            "base64encode",
            "between",
            "binary",
            "bluecoat",
            "chardoubleencode",
            "charencode",
            "charunicodeencode",
            "charunicodeescape",
            "commalesslimit",
            "commalessmid",
            "commentbeforeparentheses",
            "concat2concatws",
            "decentities",
            "dunion",
            "equaltolike",
            "equaltorlike",
            "escapequotes",
            "greatest",
            "halfversionedmorekeywords",
            "hex2char",
            "hexentities",
            "htmlencode",
            "if2case",
            "ifnull2casewhenisnull",
            "ifnull2ifisnull",
            "informationschemacomment",
            "least",
            "lowercase",
            "luanginx",
            "luanginxmore",
            "misunion",
            "modsecurityversioned",
            "modsecurityzeroversioned",
            "multiplespaces",
            "ord2ascii",
            "overlongutf8",
            "overlongutf8more",
            "percentage",
            "plus2concat",
            "plus2fnconcat",
            "randomcase",
            "randomcomments",
            "schemasplit",
            "scientific",
            "sleep2getlock",
            "sp_password",
            "space2comment",
            "space2dash",
            "space2hash",
            "space2morecomment",
            "space2morehash",
            "space2mssqlblank",
            "space2mssqlhash",
            "space2mysqlblank",
            "space2mysqldash",
            "space2plus",
            "space2randomblank",
            "substring2leftright",
            "symboliclogical",
            "unionalltounion",
            "unmagicquotes",
            "uppercase",
            "varnish",
            "versionedkeywords",
            "versionedmorekeywords",
            "xforwardedfor"
        ];

        this.templates = {
            basic_get: {
                name: "tbd",
                description: "tbd",
                options: {url: "", batch: true, dbs: true}
            },
            post_form: {
                name: "tbd", 
                description: "tbd",
                options: {url: "", data: "", batch: true}
            },
            burp_request: {
                name: "Burp Request",
                description: "tbd",
                options: {requestFile: "", batch: true}
            },
            advanced: {
                name: "tbd",
                description: "tbd",
                options: {url: "", level: 3, risk: 2, randomAgent: true, batch: true}
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupSliders();
        this.handleHashtag();
        this.updateCommand();
    }

    setStandardConfigItem_Input(config, confkey) {
        var id = this.paramMapping[confkey];
        var elem = document.getElementById(id);
        var value = null;
        if (elem.type === 'checkbox') {
            value = elem.checked;
        } 
        else if (elem.type === 'text' || elem.type === 'number' || elem.type === 'url' || elem.type === 'select-one') {
            value = elem.value.trim();
        }        
        else if (elem.type === 'textarea') {
            value = elem.value.trim().replaceAll("\n", "\\\n");
        }

        if (value) {
            config[confkey] = value;
        }
    }

    getCurrentConfig() {
        const config = {};
        
        // # TARGET TAB
        this.setStandardConfigItem_Input(config, '-u');
        this.setStandardConfigItem_Input(config, '-d');
        this.setStandardConfigItem_Input(config, '-g');
        this.setStandardConfigItem_Input(config, '-m');
        this.setStandardConfigItem_Input(config, '-l');
        
        const burpFileScope = document.getElementById('burpFileScope').value.trim();
        if (burpFileScope) config['--scope'] = burpFileScope;
        if (burpFileScope && !burpFile) document.getElementById('burpFile').value = "burp.txt";
        
        // # CONNECECTION TAB
        // ## Connection Control
        const timeout = document.getElementById('timeout').value;
        if (timeout && timeout != 30) config['--timeout'] = timeout;

        const delay = document.getElementById('delay').value;
        if (delay && delay > 0) config['--delay'] = delay;

        const threads = document.getElementById('threads').value;
        if (threads && threads > 1) config['--threads'] = threads;

        this.setStandardConfigItem_Input(config, '--force-ssl');
        this.setStandardConfigItem_Input(config, '--keep-alive');
        this.setStandardConfigItem_Input(config, '--null-connection');
        this.setStandardConfigItem_Input(config, '--http2');

        // ## Proxy Options
        this.setStandardConfigItem_Input(config, '--proxy');
        this.setStandardConfigItem_Input(config, '--proxy-cred');
        this.setStandardConfigItem_Input(config, '--proxy-file');
        
        const proxyFreq = document.getElementById('proxyFreq').value.trim();
        if (proxyFreq && proxyFreq >= 1) config['--proxy-freq'] = proxyFreq;
        
        this.setStandardConfigItem_Input(config, '--http2');
        this.setStandardConfigItem_Input(config, '--ignore-proxy');
        this.setStandardConfigItem_Input(config, '--tor');
        this.setStandardConfigItem_Input(config, '--check-tor');  
        this.setStandardConfigItem_Input(config, '--tor-port');   

        const torType = document.getElementById('torType').value.trim();
        if (torType && torType !== "SOCKS5") config['--tor-type'] = torType;        

        // # REQUEST TAB
        // ## Request Data
        const method = document.getElementById('method').value;
        if (method && method !== 'custom') {
            config['--method'] = method;
        } else if (method === 'custom') {
            const customHttpMethod = document.getElementById('customHttpMethod').value.trim();
            if (customHttpMethod) config['--method'] = customHttpMethod;
        }

        const paramDel = document.getElementById('paramDel').value.trim();
        if (paramDel && paramDel !== "&") config['--param-del'] = paramDel;

        this.setStandardConfigItem_Input(config, '-r');   
        this.setStandardConfigItem_Input(config, '--data');   

        // ## Request Headers
        this.setStandardConfigItem_Input(config, '--host');   
        
        const userAgent = document.getElementById('userAgent').value;
        if (userAgent && userAgent === 'random') {
            config['--random-agent'] = true;
        }
        else if (userAgent && userAgent === 'mobile') {
            config['--mobile'] = true;
        }
        else if (userAgent && userAgent === 'custom') {
            const customUserAgent = document.getElementById('customUserAgent').value;
            if (customUserAgent) config['-A'] = customUserAgent;
        }
        else if (userAgent) {
            config['-A'] = userAgent;
        }

        this.setStandardConfigItem_Input(config, '--referer');  
        this.setStandardConfigItem_Input(config, '-H');  

        // ## Authentication
        this.setStandardConfigItem_Input(config, '--cookie'); 
        this.setStandardConfigItem_Input(config, '--cookie-del'); 
        this.setStandardConfigItem_Input(config, '--live-cookies'); 
        this.setStandardConfigItem_Input(config, '--load-cookies'); 

        this.setStandardConfigItem_Input(config, '--drop-set-cookie');   
        
        const authType = document.getElementById('authType').value;
        const authCred = document.getElementById('authCred').value.trim();
        if (authType && authCred) {
            config['--auth-type'] = authType;
            config['--auth-cred'] = authCred;
        }
        
        this.setStandardConfigItem_Input(config, '--auth-file'); 

        // ## CSRF Tokens Control
        this.setStandardConfigItem_Input(config, '--csrf-token'); 
        this.setStandardConfigItem_Input(config, '--csrf-url'); 

        const csrfMethod = document.getElementById('csrfMethod').value;
        if (csrfMethod && csrfMethod !== 'custom') {
            config['--csrf-method'] = csrfMethod;
        } else if (csrfMethod === 'custom') {
            const customCsrfMethod = document.getElementById('customCsrfMethod').value;
            if (customCsrfMethod) config['--csrf-method'] = customCsrfMethod;
        }
        
        const csrfRetries = document.getElementById('csrfRetries').value.trim();
        if (csrfRetries && csrfRetries > 0) config['--csrf-retries'] = csrfRetries;

        // # INJECTION TAB
        // ## Parameters
        this.setStandardConfigItem_Input(config, '-p'); 
        this.setStandardConfigItem_Input(config, '--skip'); 
        this.setStandardConfigItem_Input(config, '--param-exclude'); 
        this.setStandardConfigItem_Input(config, '--param-filter'); 
        this.setStandardConfigItem_Input(config, '--prefix'); 
        this.setStandardConfigItem_Input(config, '--suffix'); 

        // ## Detection
        this.setStandardConfigItem_Input(config, '--string');
        this.setStandardConfigItem_Input(config, '--regexp');    
        this.setStandardConfigItem_Input(config, '--not-string');
       
        const code = document.getElementById('code').value.trim();
        if (code && code >= 100 && code <= 599) config['--code'] = code;

        this.setStandardConfigItem_Input(config, '--text-only');  
        this.setStandardConfigItem_Input(config, '--titles');  
        
        // ## Attack Optimalization
        const level = document.getElementById('level').value;
        if (level > 1) config['--level'] = level;
        
        const risk = document.getElementById('risk').value;
        if (risk > 1) config['--risk'] = risk;

        this.setStandardConfigItem_Input(config, '--dbms'); 
        this.setStandardConfigItem_Input(config, '--os'); 
        this.setStandardConfigItem_Input(config, '--second-url');
        this.setStandardConfigItem_Input(config, '--second-req');
        
        const techniques = [];
        if (document.getElementById('techB').checked) techniques.push('B');
        if (document.getElementById('techE').checked) techniques.push('E');
        if (document.getElementById('techU').checked) techniques.push('U');
        if (document.getElementById('techS').checked) techniques.push('S');
        if (document.getElementById('techT').checked) techniques.push('T');
        if (document.getElementById('techQ').checked) techniques.push('Q');
        if (techniques.length > 0) config['--technique'] = techniques.join('');

        this.setStandardConfigItem_Input(config, '--invalid-bignum');
        this.setStandardConfigItem_Input(config, '--invalid-logical');
        this.setStandardConfigItem_Input(config, '--invalid-string');
        this.setStandardConfigItem_Input(config, '--no-cast');
        this.setStandardConfigItem_Input(config, '--no-escape');
        this.setStandardConfigItem_Input(config, '--predict-output');

        // # EXPLOITATION TAB
        // ## Enumeration and Data Exfiltraion
        this.setStandardConfigItem_Input(config, '--all');
        this.setStandardConfigItem_Input(config, '--banner');
        this.setStandardConfigItem_Input(config, '--columns');
        this.setStandardConfigItem_Input(config, '--comments');
        this.setStandardConfigItem_Input(config, '--count');
        this.setStandardConfigItem_Input(config, '--current-user');
        this.setStandardConfigItem_Input(config, '--current-db');
        this.setStandardConfigItem_Input(config, '--dbs');
        this.setStandardConfigItem_Input(config, '--dump');
        this.setStandardConfigItem_Input(config, '--dump-all');
        this.setStandardConfigItem_Input(config, '--hostname');
        this.setStandardConfigItem_Input(config, '--is-dba');
        this.setStandardConfigItem_Input(config, '--exclude-sysdbs');
        this.setStandardConfigItem_Input(config, '--passwords');
        this.setStandardConfigItem_Input(config, '--privileges');
        this.setStandardConfigItem_Input(config, '--roles');
        this.setStandardConfigItem_Input(config, '--schema');
        this.setStandardConfigItem_Input(config, '--search');
        this.setStandardConfigItem_Input(config, '--statements');
        this.setStandardConfigItem_Input(config, '--tables');
        this.setStandardConfigItem_Input(config, '--users');

        // ## Other Exploitation Options
        this.setStandardConfigItem_Input(config, '-D');
        this.setStandardConfigItem_Input(config, '-T');
        this.setStandardConfigItem_Input(config, '-C');
        this.setStandardConfigItem_Input(config, '-X');
        this.setStandardConfigItem_Input(config, '-U');
        this.setStandardConfigItem_Input(config, '--pivot-column');
        this.setStandardConfigItem_Input(config, '--where');
        this.setStandardConfigItem_Input(config, '--start');
        this.setStandardConfigItem_Input(config, '--stop');
        this.setStandardConfigItem_Input(config, '--first');
        this.setStandardConfigItem_Input(config, '--last');
        this.setStandardConfigItem_Input(config, '--sql-query');
        this.setStandardConfigItem_Input(config, '--sql-file');

        // # TAMPERING TAB
        const tamperScripts = [];
        this.tamperScriptList.forEach(s => {
            if (document.getElementById('tamperscript-'+s).checked) tamperScripts.push(s);
        });
        const tamper = document.getElementById('tamper');
        tamper.value = tamperScripts.join(',');
        if (tamper.value.trim()) config['--tamper'] = tamper.value.trim();
        
        
        // SQLMAP TAB
        const verbose = document.getElementById('verbose').value;
        if (verbose != 1) config['-v'] = verbose;

        this.setStandardConfigItem_Input(config, '-t');
        this.setStandardConfigItem_Input(config, '-c');
        this.setStandardConfigItem_Input(config, '--batch');
        this.setStandardConfigItem_Input(config, '--parse-errors');
        
        return config;
    }

    setupEventListeners() {
        // Copy button
        document.getElementById('copyBtn').addEventListener('click', () => this.copyCommand());
        document.getElementById('copyUrlBtn').addEventListener('click', () => this.copyUrl());
        
        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadTemplate(e.target.dataset.template));
        });
        
        // Configuration buttons
        document.getElementById('saveConfig').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('loadConfig').addEventListener('click', () => this.loadConfiguration());
        document.getElementById('resetConfig').addEventListener('click', () => this.resetConfiguration());
        
        // All form inputs
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => this.updateCommand());
            input.addEventListener('change', () => this.updateCommand());
        });

        // HTTP method custom field toggle
        document.getElementById('method').addEventListener('change', (e) => {
            const customHttpGroup = document.getElementById('customHttpMethodGroup');
            if (e.target.value === 'custom') {
                customHttpGroup.style.display = 'block';
            } else {
                customHttpGroup.style.display = 'none';
            }
        });
        
        // User-Agent custom field toggle
        document.getElementById('userAgent').addEventListener('change', (e) => {
            const customUserAgentGroup = document.getElementById('customUserAgentGroup');
            if (e.target.value === 'custom') {
                customUserAgentGroup.style.display = 'block';
            } else {
                customUserAgentGroup.style.display = 'none';
            }
        });

        // CSRF method custom field toggle
        document.getElementById('csrfMethod').addEventListener('change', (e) => {
            const customCsrfMethodGroup = document.getElementById('customCsrfMethodGroup');
            if (e.target.value === 'custom') {
                customCsrfMethodGroup.style.display = 'block';
            } else {
                customCsrfMethodGroup.style.display = 'none';
            }
        });
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all tabs and content
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
            });
        });
    }

    setupSliders() {
        // Level slider
        const levelSlider = document.getElementById('level');
        const levelValue = document.getElementById('levelValue');
        levelSlider.addEventListener('input', (e) => {
            levelValue.textContent = e.target.value;
            let levelHelp = "";
            switch (levelSlider.value) {
                case "1": levelHelp = "1: Fastest and least intrusive testing of GET and POST parameters (default)."; break;
                case "2": levelHelp = "2: Additionally test injections in the Cookie header."; break;
                case "3": levelHelp = "3: Additionally test injections in User-Agent and Referer headers ."; break;
                case "4": levelHelp = "4: Additionally perform more advanced tests, such as null values and some extra payloads."; break;
                case "5": levelHelp = "5: Additionally test Host header, using all possible payloads."; break;
            }
            document.getElementById('level-help').textContent = levelHelp;
        });

        // Risk slider
        const riskSlider = document.getElementById('risk');
        const riskValue = document.getElementById('riskValue');
        riskSlider.addEventListener('input', (e) => {
            riskValue.textContent = e.target.value;
            let riskHelp = "";
            switch (riskSlider.value) {
                case "1": riskHelp = "1: Innocuous test for the majority of SQL injection points (default)."; break;
                case "2": riskHelp = "2: Adds also time-based SQL injections."; break;
                case "3": riskHelp = "3: Adds also OR-based SQL injection tests."; break;
            }
            document.getElementById('risk-help').textContent = riskHelp;
        });

        // Verbose slider
        const verboseSlider = document.getElementById('verbose');
        const verboseValue = document.getElementById('verboseValue');
        verboseSlider.addEventListener('input', (e) => {
            verboseValue.textContent = e.target.value;
            let verboseHelp = "";
            switch (verboseSlider.value) {
                case "0": verboseHelp = "0: Show only Python tracebacks, error and critical messages."; break;
                case "1": verboseHelp = "1: Show also information and warning messages (default)."; break;
                case "2": verboseHelp = "2: Show also debug messages."; break;
                case "3": verboseHelp = "3: Show also payloads injected."; break;
                case "4": verboseHelp = "4: Show also HTTP requests."; break;
                case "5": verboseHelp = "5: Show also HTTP responses' headers."; break;
                case "6": verboseHelp = "6: Show also HTTP responses' page content."; break;
            }
            document.getElementById('verbose-help').textContent = verboseHelp;
        });
    }

    generateCommand() {
        const config = this.getCurrentConfig();
        let command = 'sqlmap';
        
        // Order of parameters for better readability
        const paramOrder = Object.keys(this.paramMapping);
        
        // Add parameters in order
        paramOrder.forEach(param => {
            if (config.hasOwnProperty(param)) {
                if (config[param] === true) {
                    command += ` ${param}`;
                } else {
                    // Quote values that contain spaces or special characters
                    const value = config[param].toString();
                    if (value.includes(' ') || value.includes('&') || value.includes(';') || value.includes('=') || value.includes('\n')) {
                        command += ` ${param} "${value}"`;
                    }
                    else if (value.includes('"')) {
                        command += ` ${param} ` + value.replaceAll('"', '\\"');
                    }
                    else {
                        command += ` ${param} ${value}`;
                    }
                }
            }
        });
        
        return command;
    }

    handleHashtag() {
        // Check if we have hashtag with proper config and load it if so
        try {
            let hashtag = location.hash.substr(1);
            if (hashtag.length > 0 && hashtag !== "e30=") {
                let hashtagCmd = JSON.parse(atob(hashtag));
                this.applyConfiguration(hashtagCmd);
                this.showMessage("Configuration loaded from the URL", 'success');
            }
        } catch (ex) {
            this.showMessage("Cannot load a configuration", 'error');
            console.log(ex);
        } 
    }

    updateCommand() {
            const command = this.generateCommand();
            const commandOutput = document.getElementById('commandOutput');
            commandOutput.textContent = command;

            // Add syntax highlighting
            this.applySyntaxHighlighting(commandOutput);
    }

    applySyntaxHighlighting(element) {
        
        let html = element.textContent;
        
        // Highlight options (starting with -)
        html = html.replace(/(--?[\w-]+)/g, "<span class='option'>$1</span>");
        
        // Highlight quoted values
        html = html.replace(/"([^"]+)"/g, "<span class='value'>\"$1\"</span>");
        
        // Highlight sqlmap command
        html = html.replace(/^sqlmap/, "<span class='flag'>sqlmap</span>");
        
        element.innerHTML = html;
        
    }

    async copyCommand() {
        const command = this.generateCommand();
        const copyBtn = document.getElementById('copyBtn');
        const successMessage = "SQLMap command has been copied to your clipboard";

        try 
        {
            copyBtn.classList.add('copying');
            await navigator.clipboard.writeText(command);
            this.showMessage(successMessage, "success");
        } 
        catch (err) 
        {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = command;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage(successMessage, "success");
        }
        finally 
        {
            setTimeout(() => {
                copyBtn.classList.remove('copying');
            }, 1000);
        }
    }

    async copyUrl() {
        const serializedCommand = btoa(JSON.stringify(this.getCurrentConfig()));
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        const successMessage = "URL with configuration has been copied to your clipboard";
        if (serializedCommand == "e30=") {
            location.replace("#");
        }
        else {
            location.replace("#" + serializedCommand);
        }

        try 
        {
            copyUrlBtn.classList.add('copying');
            await navigator.clipboard.writeText(location.href);
            this.showMessage(successMessage, "success");
        } 
        catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage(successMessage, "success");
        } 
        finally {
            setTimeout(() => {
                copyUrlBtn.classList.remove('copying');
            }, 1000);
        }
    }

    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;
        
        // Reset all form fields first
        this.resetConfiguration();
        
        // Apply template options
        Object.entries(template.options).forEach(([key, value]) => {
            let elementId = key;
            
            // Map template keys to form element IDs
            const keyMapping = {
                'url': 'url',
                'data': 'data',
                'requestFile': 'requestFile',
                'burpFile': 'burpFile',
                'level': 'level',
                'risk': 'risk',
                'randomAgent': 'userAgent',
                'batch': 'batch',
                'dbs': 'dbs'
            };
            
            if (keyMapping[key]) {
                elementId = keyMapping[key];
            }
            
            const element = document.getElementById(elementId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else if (element.type === 'range') {
                    element.value = value;
                    // Update slider display
                    const displayElement = document.getElementById(elementId + 'Value');
                    if (displayElement) {
                        displayElement.textContent = value;
                    }
                } else {
                    element.value = value;
                }
            }
        });
        
        // Update command after loading template
        this.updateCommand();
        
        // Show success message
        this.showMessage(`Template "${template.name}" loaded`, 'success');
    }

    saveConfiguration() {
        const config = this.getCurrentConfig();
        const configStr = JSON.stringify(config, null, 2);
        
        // Create downloadable file
        const blob = new Blob([configStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sqlmap-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('Configuration saved', 'success');
    }

    loadConfiguration() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    this.applyConfiguration(config);
                    this.showMessage('Configuration loaded', 'success');
                } catch (err) {
                    this.showMessage('Error during loading the config', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    applyConfiguration(config) {
        // Reset form first
        this.resetConfiguration(true);
        
        // Apply configuration
        Object.entries(config).forEach(([param, value]) => {
            
            const elementId = this.paramMapping[param];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value === true;
                    }
                    else if (param === '--technique') {
                        // Handle technique checkboxes
                        ['B', 'E', 'U', 'S', 'T'].forEach(tech => {
                            const techElement = document.getElementById('tech' + tech);
                            if (techElement) {
                                techElement.checked = value.includes(tech);
                            }
                        });
                    }
                    else if (param === '--tamper') {
                        // Handle tamperscripts checkboxes
                        this.tamperScriptList.forEach(s => {
                            const sElement = document.getElementById('tamperscript-' + s);
                            if (sElement) {
                                sElement.checked = value.includes(s);
                            }
                        });
                    }
                    else {
                        element.value = value;
                        
                        // Update slider displays
                        if (element.type === 'range') {
                            const displayElement = document.getElementById(elementId + 'Value');
                            if (displayElement) {
                                displayElement.textContent = value;
                            }
                        }
                    }
                }
            }
        });
        
        this.updateCommand();
    }

    resetConfiguration(skipResetAlert = false) {
        // Reset all form fields
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else if (element.type === 'range') {
                element.value = element.min || 1;
                // Update slider displays
                const displayElement = document.getElementById(element.id + 'Value');
                if (displayElement) {
                    displayElement.textContent = element.value;
                }
            } else {
                element.value = '';
            }
        });
        
        // Reset verbose to default
        document.getElementById('verbose').value = 1; 
        document.getElementById('verboseValue').textContent = "1"; 
        document.getElementById('verbose-help').textContent = "1: Show also information and warning messages (default).";
        // Hide custom user agent field
        document.getElementById('customHttpMethodGroup').style.display = 'none';
        document.getElementById('customUserAgentGroup').style.display = 'none';
        document.getElementById('customCsrfMethodGroup').style.display = 'none';
        
        this.updateCommand();
        if (!skipResetAlert) {
            this.showMessage('The configuration has been cleared', 'success');
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `status status--${type}`;
        messageEl.textContent = message;
        
        document.getElementById("status-container").appendChild(messageEl);
        
        // Remove after 6 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 6000);
    }
}

// Initialize the application when DOM is loaded
let sqlgen = null;
document.addEventListener('DOMContentLoaded', () => {
    sqlgen = new SQLMapGenerator();
    document.querySelectorAll('input[type=text], textarea').forEach(field => field.spellcheck = false);
});

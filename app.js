class SQLMapGenerator {
    constructor() {
        this.config = {};
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

    getCurrentConfig() {
        const config = {};
        
        // Target options
        const url = document.getElementById('url').value.trim();
        if (url) config['-u'] = url;

        const directDb = document.getElementById('directDb').value.trim();
        if (directDb) config['-d'] = directDb;
        
        const requestFile = document.getElementById('requestFile').value.trim();
        if (requestFile) config['-r'] = requestFile;
        
        const targetsFile = document.getElementById('targetsFile').value.trim();
        if (targetsFile) config['-m'] = targetsFile;

        const burpFile = document.getElementById('burpFile').value.trim();
        if (burpFile) config['-l'] = burpFile;

        const burpFileScope = document.getElementById('burpFileScope').value.trim();
        if (burpFileScope) config['--scope'] = burpFileScope;
        if (burpFileScope && !burpFile) document.getElementById('burpFile').value = "burp.txt";
        
        const googleDork = document.getElementById('googleDork').value.trim();
        if (googleDork) config['-g'] = googleDork;

        // Connection options
        const timeout = document.getElementById('timeout').value;
        if (timeout && timeout != 30) config['--timeout'] = timeout;

        const delay = document.getElementById('delay').value;
        if (delay && delay > 0) config['--delay'] = delay;

        const threads = document.getElementById('threads').value;
        if (threads && threads > 1) config['--threads'] = threads;

        const forceSsl = document.getElementById('forceSsl').checked;
        if (forceSsl) config['--force-ssl'] = forceSsl;

        const keepAlive = document.getElementById('keepAlive').checked;
        if (keepAlive) config['--keep-alive'] = keepAlive;

        const nullConnection = document.getElementById('nullConnection').checked;
        if (nullConnection) config['--null-connection'] = nullConnection;

        const http2 = document.getElementById('http2').checked;
        if (http2) config['--http2'] = http2;

        const proxy = document.getElementById('proxy').value.trim();
        if (proxy) config['--proxy'] = proxy;

        const proxyCred = document.getElementById('proxyCred').value.trim();
        if (proxyCred) config['--proxy-cred'] = proxyCred;
        
        const proxyFile = document.getElementById('proxyFile').value.trim();
        if (proxyFile) config['--proxy-file'] = proxyFile;
        
        const proxyFreq = document.getElementById('proxyFreq').value.trim();
        if (proxyFreq && proxyFreq >= 1) config['--proxy-freq'] = proxyFreq;
        
        const proxyIgnore = document.getElementById('proxyIgnore').checked
        if (proxyIgnore) config['--ignore-proxy'] = proxyIgnore;

        const tor = document.getElementById('tor').checked;
        if (tor) config['--tor'] = tor;        

        const checkTor = document.getElementById('checkTor').checked;
        if (checkTor) config['--check-tor'] = checkTor;

        const torPort = document.getElementById('torPort').value.trim();
        if (torPort) config['--tor-port'] = torPort;        

        const torType = document.getElementById('torType').value.trim();
        if (torType && torType !== "SOCKS5") config['--tor-type'] = torType;        


        const method = document.getElementById('method').value;
        if (method && method !== 'custom') {
            config['--method'] = method;
        } else if (method === 'custom') {
            const customHttpMethod = document.getElementById('customHttpMethod').value.trim();
            if (customHttpMethod) config['--method'] = customHttpMethod;
        }
            
        const data = document.getElementById('data').value.trim().replaceAll("\n", "\\\n");
        if (data) config['--data'] = data;

        const string = document.getElementById('string').value.trim();
        if (string) config['--string'] = string;

        const notString = document.getElementById('notString').value.trim();
        if (notString) config['--not-string'] = notString;

        const regexp = document.getElementById('regexp').value.trim();
        if (regexp) config['--regexp'] = regexp;

        const code = document.getElementById('code').value.trim();
        if (code && code >= 100 && code <= 599) config['--code'] = code;

        const textOnly = document.getElementById('textOnly').checked
        if (textOnly) config['--text-only'] = textOnly;

        const titles = document.getElementById('titles').checked
        if (titles) config['--titles'] = titles;
        
        // Request options
        const host = document.getElementById('host').value.trim();
        if (host) config['--host'] = host;

        const paramDel = document.getElementById('paramDel').value.trim();
        if (paramDel && paramDel !== "&") config['--param-del'] = paramDel;
        
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

        const referer = document.getElementById('referer').value.trim();
        if (referer) config['--referer'] = referer;

        const headers = document.getElementById('headers').value.trim().replaceAll("\n", "\\\n");
        if (headers) config['-H'] = headers;
        
        const cookie = document.getElementById('cookie').value.trim();
        if (cookie) config['--cookie'] = cookie;
        
        const cookieDel = document.getElementById('cookieDel').value.trim();
        if (cookieDel) config['--cookie-del'] = cookieDel;
        
        const cookieLive = document.getElementById('cookieLive').value.trim();
        if (cookieLive) config['--live-cookies'] = cookieLive;
        
        const cookieLoad = document.getElementById('cookieLoad').value.trim();
        if (cookieLoad) config['--load-cookies'] = cookieLoad;

        const cookieDrop = document.getElementById('cookieDrop').checked;
        if (cookieDrop) config['--drop-set-cookie'] = cookieDrop;
        
        const authType = document.getElementById('authType').value;
        const authCred = document.getElementById('authCred').value.trim();
        if (authType && authCred) {
            config['--auth-type'] = authType;
            config['--auth-cred'] = authCred;
        }
        
        const authFile = document.getElementById('authFile').value.trim();
        if (authFile) config['--auth-file'] = authFile;
        
        const csrfToken = document.getElementById('csrfToken').value.trim();
        if (csrfToken) config['--csrf-token'] = csrfToken;

        const csrfMethod = document.getElementById('csrfMethod').value;
        if (csrfMethod && csrfMethod !== 'custom') {
            config['--csrf-method'] = csrfMethod;
        } else if (csrfMethod === 'custom') {
            const customCsrfMethod = document.getElementById('customCsrfMethod').value;
            if (customCsrfMethod) config['--csrf-method'] = customCsrfMethod;
        }
        
        const csrfUrl = document.getElementById('csrfUrl').value.trim();
        if (csrfUrl) config['--csrf-url'] = csrfUrl;

        const csrfRetries = document.getElementById('csrfRetries').value.trim();
        if (csrfRetries && csrfRetries > 0) config['--csrf-retries'] = csrfRetries;
        
        // Injection options
        const paramTest = document.getElementById('paramTest').value.trim();
        if (paramTest) config['-p'] = paramTest;
        
        const paramSkip = document.getElementById('paramSkip').value.trim(); 
        if (paramSkip) config['--skip'] = paramSkip;
        
        const paramExclude = document.getElementById('paramExclude').value.trim();
        if (paramExclude) config['--param-exclude'] = paramExclude;
        
        const paramFilter = document.getElementById('paramFilter').value.trim();
        if (paramFilter) config['--param-filter'] = paramFilter;
        
        const level = document.getElementById('level').value;
        if (level > 1) config['--level'] = level;
        
        const risk = document.getElementById('risk').value;
        if (risk > 1) config['--risk'] = risk;
        
        const dbms = document.getElementById('dbms').value;
        if (dbms) config['--dbms'] = dbms;
        
        const os = document.getElementById('os').value;
        if (os) config['--os'] = os;

        const prefix = document.getElementById('prefix').value.trim();
        if (prefix) config['--prefix'] = prefix;

        const suffix = document.getElementById('suffix').value.trim();
        if (suffix) config['--suffix'] = suffix;

        const secondUrl = document.getElementById('secondUrl').value.trim();
        if (secondUrl) config['--second-url'] = secondUrl;
        
        // Techniques
        const techniques = [];
        if (document.getElementById('techB').checked) techniques.push('B');
        if (document.getElementById('techE').checked) techniques.push('E');
        if (document.getElementById('techU').checked) techniques.push('U');
        if (document.getElementById('techS').checked) techniques.push('S');
        if (document.getElementById('techT').checked) techniques.push('T');
        if (document.getElementById('techQ').checked) techniques.push('Q');
        if (techniques.length > 0) config['--technique'] = techniques.join('');

        const tamperScripts = [];
        this.tamperScriptList.forEach(s => {
            if (document.getElementById('tamperscript-'+s).checked) tamperScripts.push(s);
        });
        const tamper = document.getElementById('tamper');
        tamper.value = tamperScripts.join(',');
        if (tamper.value.trim()) config['--tamper'] = tamper.value.trim();
        
        const invalidBignum = document.getElementById('invalidBignum').checked;
        if (invalidBignum) config['--invalid-bignum'] = invalidBignum;
        
        const invalidLogical = document.getElementById('invalidLogical').checked;
        if (invalidLogical) config['--invalid-logical'] = invalidLogical;

        const invalidString = document.getElementById('invalidString').checked;
        if (invalidString) config['--invalid-string'] = invalidString;
        
        const noCast = document.getElementById('noCast').checked;
        if (noCast) config['--no-cast'] = noCast;

        const noEscape = document.getElementById('noEscape').checked;
        if (noEscape) config['--no-escape'] = noEscape;

        const predictOutput = document.getElementById('predictOutput').checked;
        if (predictOutput) config['--predict-output'] = predictOutput;
        
        // SQLMAP options
        if (document.getElementById('batch').checked) config['--batch'] = true;
        
        const verbose = document.getElementById('verbose').value;
        if (verbose != 1) config['-v'] = verbose;
        
        const trafficFile = document.getElementById('trafficFile').value.trim();
        if (trafficFile) config['-t'] = trafficFile;
        
        if (document.getElementById('parseErrors').checked) config['--parse-errors'] = true;
        
        // Post-exploitation options
        if (document.getElementById('all').checked) config['--all'] = true;
        if (document.getElementById('banner').checked) config['--banner'] = true;
        if (document.getElementById('columns').checked) config['--columns'] = true;
        if (document.getElementById('comments').checked) config['--comments'] = true;
        if (document.getElementById('count').checked) config['--count'] = true;
        if (document.getElementById('currentUser').checked) config['--current-user'] = true;
        if (document.getElementById('currentDb').checked) config['--current-db'] = true;
        if (document.getElementById('dbs').checked) config['--dbs'] = true;
        if (document.getElementById('dump').checked) config['--dump'] = true;
        if (document.getElementById('dumpAll').checked) config['--dump-all'] = true;
        if (document.getElementById('hostname').checked) config['--hostname'] = true;
        if (document.getElementById('isDba').checked) config['--is-dba'] = true;
        if (document.getElementById('passwords').checked) config['--passwords'] = true;
        if (document.getElementById('privileges').checked) config['--privileges'] = true;
        if (document.getElementById('roles').checked) config['--roles'] = true;
        if (document.getElementById('schema').checked) config['--schema'] = true;
        if (document.getElementById('search').checked) config['--search'] = true;
        if (document.getElementById('statements').checked) config['--statements'] = true;
        if (document.getElementById('tables').checked) config['--tables'] = true;
        if (document.getElementById('users').checked) config['--users'] = true;
        
        const database = document.getElementById('database').value.trim();
        if (database) config['-D'] = database;
        
        const table = document.getElementById('table').value.trim();
        if (table) config['-T'] = table;
        
        const column = document.getElementById('column').value.trim();
        if (column) config['-C'] = column;        

        const exclude = document.getElementById('exclude').value.trim();
        if (exclude) config['-X'] = exclude;
        
        const user = document.getElementById('user').value.trim();
        if (user) config['-U'] = user;        
        
        const pivotColumn = document.getElementById('pivotColumn').value.trim();
        if (pivotColumn) config['--pivot-column'] = pivotColumn;        

        const where = document.getElementById('where').value.trim();
        if (where) config['--where'] = where;

        const start = document.getElementById('start').value.trim();
        if (start) config['--start'] = start;
        
        const stop = document.getElementById('stop').value.trim();
        if (stop) config['--stop'] = stop;
        
        const first = document.getElementById('first').value.trim();
        if (first) config['--first'] = first;
        
        const last = document.getElementById('last').value.trim();
        if (last) config['--last'] = last;
        
        return config;
    }

    generateCommand() {
        const config = this.getCurrentConfig();
        let command = 'sqlmap';
        
        // Order of parameters for better readability
        const paramOrder = [
            '-u', '-d', '-r', '-m', '-l', '--scope', '-g',
             '--timeout', '--delay', '--threads',
            '--proxy', '--proxy-cred', '--proxy-file', '--proxy-freq', '--ignore-proxy',
            '--tor', '--check-tor', '--tor-port', '--tor-type',
            '--force-ssl', '--keep-alive', '--null-connection', '--http2',
            '--method', '--data', '--param-del',
            '--string', '--not-string', '--regexp', '--code', '--text-only', '--titles',
            '--host', '-A', '--mobile', '--random-agent', "--referer", "-H",
            '--cookie', '--cookie-del', '--live-cookies', '--load-cookies', '--drop-set-cookie',
            '--auth-type', '--auth-cred', '--auth-file',
            '--csrf-token', '--csrf-url', '--csrf-method', '--csrf-retries',
            '-p', '--skip', '--param-exclude', '--param-filter', '--level', '--risk', '--dbms', '--os',
            '--technique', '--invalid-bignum', '--invalid-logical', '--invalid-string', '--no-cast', '--no-escape', '--predict-output',
            '--batch', '-v', '-t', '--parse-errors', '--test-filter',
            '--all', '--banner', '--columns', '--comments', '--count', '--current-user', '--current-db', '--dbs', '--dump', '--dump-all', 
            '--hostname', '--is-dba', '--passwords', '--privileges', '--roles', '--schema', '--search', '--statements', '--tables', '--users',
            '-D', '-T', '-C', '-X', '-U', '--pivot-column', '--where', '--start', '--stop', '--first', '--last',
            '--tamper', '--prefix', '--suffix', '--csrf-token', '--csrf-url', '--second-url'
        ];
        
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
            if (hashtag.length > 0) {
                let hashtagCmd = JSON.parse(atob(hashtag));
                this.applyConfiguration(hashtagCmd);
            }
        } catch (ex) {
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
        const copyText = document.getElementById('copyText');
        const txt_command_copy_clipboard = 'COPY COMMAND TO CLIPBOARD';
        const txt_command_copy_copied = 'COMMAND COPIED!';
        
        try {
            await navigator.clipboard.writeText(command);
            copyBtn.classList.add('copying');
            copyText.textContent = txt_command_copy_copied;
            
            setTimeout(() => {
                copyBtn.classList.remove('copying');
                copyText.textContent = txt_command_copy_clipboard;
            }, 3000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = command;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyText.textContent = txt_command_copy_copied;
            setTimeout(() => {
                copyText.textContent = txt_command_copy_clipboard;
            }, 3000);
        }
    }

    async copyUrl() {
        const serializedCommand = btoa(JSON.stringify(this.getCurrentConfig()));
        const command = location.href.replace(location.hash, "") + "#" + serializedCommand;
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        const copyUrlText = document.getElementById('copyUrlText');
        const txt_command_url_clipboard = 'COPY CONFIG URL';
        const txt_command_url_copied = 'URL COPIED!';

        try {
            await navigator.clipboard.writeText(command);
            copyUrlBtn.classList.add('copying');
            copyUrlText.textContent = txt_command_url_copied;

            setTimeout(() => {
                copyUrlBtn.classList.remove('copying');
                copyUrlText.textContent = txt_command_url_clipboard;
            }, 3000);
            location.replace("#" + serializedCommand);

        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = command;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copyUrlText.textContent = txt_command_url_copied;
            setTimeout(() => {
                copyUrlText.textContent = txt_command_url_clipboard;
            }, 3000);
            location.replace("#" + serializedCommand);
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
        this.resetConfiguration();
        
        // Apply configuration
        Object.entries(config).forEach(([param, value]) => {
            // Map parameters to form element IDs
            const paramMapping = {
                '-u': 'url',
                '-d': 'directDb',
                '-r': 'requestFile',
                '-m': 'targetsFile',
                '-l': 'burpFile',
                '--scope': 'burpFileScope',
                '-g': 'googleDork',
                '--force-ssl': 'forceSsl',
                '--timeout': 'timeout',
                '--delay': 'delay',
                '--threads': 'threads',
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
                '--data': 'data',
                '--param-del': 'paramDel',
                '--prefix': 'prefix',
                '--suffix': 'suffix',
                '--host': 'host',
                '-A': 'userAgent',
                '--string': 'string',
                '--not-string': 'notString',
                '--regexp': 'regexp',
                '--code': 'code',
                '--titles': 'titles',
                '--text-only': 'textOnly',
                '--mobile': 'mobileUserAgent',
                '--random-agent': 'userAgent',
                '--referer': 'referer',
                '-H': 'headers',
                '--cookie': 'cookie',
                '--cookie-del': 'cookieDel',
                '--live-cookies': 'cookieLive',
                '--drop-set-cookie': 'cookieDrop',
                '--load-cookies': 'cookieLoad',
                '--auth-type': 'authType',
                '--auth-cred': 'authCred',
                '--auth-file': 'authFile',
                '--csrf-token': 'csrfToken',
                '--csrf-url': 'csrfUrl',
                '--csrf-method': 'csrfMethod',
                '--csrf-retries': 'csrfRetries',
                '-p': 'paramTest',
                '--skip': 'paramSkip',
                '--param-exclude': 'paramExclude',
                '--param-filter': 'paramFilter',
                '--level': 'level',
                '--risk': 'risk',
                '--dbms': 'dbms',
                '--os': 'os',
                '--technique': 'technique',
                '--invalid-bignum': 'invalidBignum',
                '--invalid-logical': 'invalidLogical', 
                '--invalid-string': 'invalidString',
                '--no-cast': 'noCast',
                '--no-escape': 'noEscape',
                '--predict-output':'predictOutput',
                '--keep-alive': 'keepAlive',
                '--batch': 'batch',
                '-v': 'verbose',
                '-t': 'trafficFile',
                '--parse-errors': 'parseErrors',
                '--test-filter': 'testFilter',
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
                '--where': 'where',
                '--start': 'start',
                '--stop': 'stop',
                '--first': 'first',
                '--last': 'last',
                '--pivot-column': 'pivotColumn',
                '--null-connection': 'nullConnection',
                '--tamper': 'tamper',
                '--second-url': 'secondUrl'
            };
            
            const elementId = paramMapping[param];
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

    resetConfiguration() {
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
        this.showMessage('Configuration deleted', 'info');
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `status status--${type}`;
        messageEl.textContent = message;
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '1000';
        messageEl.style.minWidth = '300px';
        messageEl.style.padding = '12px 16px';
        
        document.body.appendChild(messageEl);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 10000);
    }
}

// Initialize the application when DOM is loaded
let sqlgen = null;
document.addEventListener('DOMContentLoaded', () => {
    sqlgen = new SQLMapGenerator();
    document.querySelectorAll('input[type=text], textarea').forEach(field => field.spellcheck = false);
});

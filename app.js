class SQLMapGenerator {
    constructor() {
        this.config = {};
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
                case "2": levelHelp = "2: Additionaly test injections in the Cookie header."; break;
                case "3": levelHelp = "3: Additionaly test injections in User-Agent and Referer headers ."; break;
                case "4": levelHelp = "4: Additionaly perform more advbanced tests, such as null values and some extra payloads."; break;
                case "5": levelHelp = "5: Additionaly test Host header, using all possible payloads."; break;
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

        // Request options
        const method = document.getElementById('method').value;
        if (method && method !== 'custom') {
            config['--method'] = method;
        } else if (method === 'custom') {
            const customHttpMethod = document.getElementById('customHttpMethod').value.trim();
            if (customHttpMethod) config['--method'] = customHttpMethod;
        }
        
        const data = document.getElementById('data').value.trim().replaceAll("\n", "\\\n");
        if (data) config['--data'] = data;

        const paramDel = document.getElementById('paramDel').value.trim();
        if (paramDel && paramDel !== "&") config['--param-del'] = paramDel;
  
        const host = document.getElementById('host').value.trim();
        if (host) config['--host'] = host;
        
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
        if (document.getElementById('tamperscript-0eunion').checked)                    tamperScripts.push('0eunion');
        if (document.getElementById('tamperscript-apostrophemask').checked)             tamperScripts.push('apostrophemask');
        if (document.getElementById('tamperscript-apostrophenullencode').checked)       tamperScripts.push('apostrophenullencode');
        if (document.getElementById('tamperscript-appendnullbyte').checked)             tamperScripts.push('appendnullbyte');
        if (document.getElementById('tamperscript-base64encode').checked)               tamperScripts.push('base64encode');
        if (document.getElementById('tamperscript-between').checked)                    tamperScripts.push('between');
        if (document.getElementById('tamperscript-binary').checked)                     tamperScripts.push('binary');
        if (document.getElementById('tamperscript-bluecoat').checked)                   tamperScripts.push('bluecoat');
        if (document.getElementById('tamperscript-chardoubleencode').checked)           tamperScripts.push('chardoubleencode');
        if (document.getElementById('tamperscript-charencode').checked)                 tamperScripts.push('charencode');
        if (document.getElementById('tamperscript-charunicodeencode').checked)          tamperScripts.push('charunicodeencode');
        if (document.getElementById('tamperscript-charunicodeescape').checked)          tamperScripts.push('charunicodeescape');
        if (document.getElementById('tamperscript-commalesslimit').checked)             tamperScripts.push('commalesslimit');
        if (document.getElementById('tamperscript-commalessmid').checked)               tamperScripts.push('commalessmid');
        if (document.getElementById('tamperscript-commentbeforeparentheses').checked)   tamperScripts.push('commentbeforeparentheses');
        if (document.getElementById('tamperscript-concat2concatws').checked)            tamperScripts.push('concat2concatws');
        if (document.getElementById('tamperscript-decentities').checked)                tamperScripts.push('decentities');
        if (document.getElementById('tamperscript-dunion').checked)                     tamperScripts.push('dunion');
        if (document.getElementById('tamperscript-equaltolike').checked)                tamperScripts.push('equaltolike');
        if (document.getElementById('tamperscript-equaltorlike').checked)               tamperScripts.push('equaltorlike');
        if (document.getElementById('tamperscript-escapequotes').checked)               tamperScripts.push('escapequotes');
        if (document.getElementById('tamperscript-greatest').checked)                   tamperScripts.push('greatest');
        if (document.getElementById('tamperscript-halfversionedmorekeywords').checked)  tamperScripts.push('halfversionedmorekeywords');
        if (document.getElementById('tamperscript-hex2char').checked)                   tamperScripts.push('hex2char');
        if (document.getElementById('tamperscript-hexentities').checked)                tamperScripts.push('hexentities');
        if (document.getElementById('tamperscript-htmlencode').checked)                 tamperScripts.push('htmlencode');
        if (document.getElementById('tamperscript-if2case').checked)                    tamperScripts.push('if2case');
        if (document.getElementById('tamperscript-ifnull2casewhenisnull').checked)      tamperScripts.push('ifnull2casewhenisnull');
        if (document.getElementById('tamperscript-ifnull2ifisnull').checked)            tamperScripts.push('ifnull2ifisnull');
        if (document.getElementById('tamperscript-informationschemacomment').checked)   tamperScripts.push('informationschemacomment');
        if (document.getElementById('tamperscript-least').checked)                      tamperScripts.push('least');
        if (document.getElementById('tamperscript-lowercase').checked)                  tamperScripts.push('lowercase');
        if (document.getElementById('tamperscript-luanginx').checked)                   tamperScripts.push('luanginx');
        if (document.getElementById('tamperscript-luanginxmore').checked)               tamperScripts.push('luanginxmore');
        if (document.getElementById('tamperscript-misunion').checked)                   tamperScripts.push('misunion');
        if (document.getElementById('tamperscript-modsecurityversioned').checked)       tamperScripts.push('modsecurityversioned');
        if (document.getElementById('tamperscript-modsecurityzeroversioned').checked)   tamperScripts.push('modsecurityzeroversioned');
        if (document.getElementById('tamperscript-multiplespaces').checked)             tamperScripts.push('multiplespaces');
        if (document.getElementById('tamperscript-ord2ascii').checked)                  tamperScripts.push('ord2ascii');
        if (document.getElementById('tamperscript-overlongutf8').checked)               tamperScripts.push('overlongutf8');
        if (document.getElementById('tamperscript-overlongutf8more').checked)           tamperScripts.push('overlongutf8more');
        if (document.getElementById('tamperscript-percentage').checked)                 tamperScripts.push('percentage');
        if (document.getElementById('tamperscript-plus2concat').checked)                tamperScripts.push('plus2concat');
        if (document.getElementById('tamperscript-plus2fnconcat').checked)              tamperScripts.push('plus2fnconcat');
        if (document.getElementById('tamperscript-randomcase').checked)                 tamperScripts.push('randomcase');
        if (document.getElementById('tamperscript-randomcomments').checked)             tamperScripts.push('randomcomments');
        if (document.getElementById('tamperscript-schemasplit').checked)                tamperScripts.push('schemasplit');
        if (document.getElementById('tamperscript-scientific').checked)                 tamperScripts.push('scientific');
        if (document.getElementById('tamperscript-sleep2getlock').checked)              tamperScripts.push('sleep2getlock');
        if (document.getElementById('tamperscript-sp_password').checked)                tamperScripts.push('sp_password');
        if (document.getElementById('tamperscript-space2comment').checked)              tamperScripts.push('space2comment');
        if (document.getElementById('tamperscript-space2dash').checked)                 tamperScripts.push('space2dash');
        if (document.getElementById('tamperscript-space2hash').checked)                 tamperScripts.push('space2hash');
        if (document.getElementById('tamperscript-space2morecomment').checked)          tamperScripts.push('space2morecomment');
        if (document.getElementById('tamperscript-space2morehash').checked)             tamperScripts.push('space2morehash');
        if (document.getElementById('tamperscript-space2mssqlblank').checked)           tamperScripts.push('space2mssqlblank');
        if (document.getElementById('tamperscript-space2mssqlhash').checked)            tamperScripts.push('space2mssqlhash');
        if (document.getElementById('tamperscript-space2mysqlblank').checked)           tamperScripts.push('space2mysqlblank');
        if (document.getElementById('tamperscript-space2mysqldash').checked)            tamperScripts.push('space2mysqldash');
        if (document.getElementById('tamperscript-space2plus').checked)                 tamperScripts.push('space2plus');
        if (document.getElementById('tamperscript-space2randomblank').checked)          tamperScripts.push('space2randomblank');
        if (document.getElementById('tamperscript-substring2leftright').checked)        tamperScripts.push('substring2leftright');
        if (document.getElementById('tamperscript-symboliclogical').checked)            tamperScripts.push('symboliclogical');
        if (document.getElementById('tamperscript-unionalltounion').checked)            tamperScripts.push('unionalltounion');
        if (document.getElementById('tamperscript-unmagicquotes').checked)              tamperScripts.push('unmagicquotes');
        if (document.getElementById('tamperscript-uppercase').checked)                  tamperScripts.push('uppercase');
        if (document.getElementById('tamperscript-varnish').checked)                    tamperScripts.push('varnish');
        if (document.getElementById('tamperscript-versionedkeywords').checked)          tamperScripts.push('versionedkeywords');
        if (document.getElementById('tamperscript-versionedmorekeywords').checked)      tamperScripts.push('versionedmorekeywords');
        if (document.getElementById('tamperscript-xforwardedfor').checked)              tamperScripts.push('xforwardedfor');

        const tamper = document.getElementById('tamper');
        if (tamperScripts.length > 0) tamper.value = tamperScripts.join(',');
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
        if (document.getElementById('currentUser').checked) config['--current-user'] = true;
        if (document.getElementById('currentDb').checked) config['--current-db'] = true;
        if (document.getElementById('dbs').checked) config['--dbs'] = true;
        if (document.getElementById('tables').checked) config['--tables'] = true;
        if (document.getElementById('columns').checked) config['--columns'] = true;
        if (document.getElementById('schema').checked) config['--schema'] = true;
        if (document.getElementById('dumpAll').checked) config['--dump-all'] = true;
        
        const database = document.getElementById('database').value.trim();
        if (database) config['-D'] = database;
        
        const table = document.getElementById('table').value.trim();
        if (table) config['-T'] = table;
        
        const column = document.getElementById('column').value.trim();
        if (column) config['-C'] = column;
        
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
            '--force-ssl', '--keep-alive', '--null-connection', '--http2',
            '--method', '--data', '--param-del',
            '--host', '-A', '--mobile', '--random-agent', "--referer", "-H",
            '--cookie', '--cookie-del', '--live-cookies', '--load-cookies', '--drop-set-cookie',
            '--auth-type', '--auth-cred', '--auth-file',
            '--csrf-token', '--csrf-url', '--csrf-method', '--csrf-retries',
            '-p', '--skip', '--param-exclude', '--param-filter', '--level', '--risk', '--dbms', '--os',
            '--technique', '--invalid-bignum', '--invalid-logical', '--invalid-string', '--no-cast', '--no-escape', '--predict-output',
            '--batch', '-v', '-t', '--parse-errors', '--test-filter',
            '--current-user', '--current-db', '--dbs', '--tables', '--columns', '--schema', '--dump-all',
            '-D', '-T', '-C', '-o',
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
        
        try {
            await navigator.clipboard.writeText(command);
            copyBtn.classList.add('copying');
            copyText.textContent = 'Command Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copying');
                copyText.textContent = 'COPY COMMAND TO A CLIPBOARD';
            }, 3000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = command;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyText.textContent = 'Command Copied!';
            setTimeout(() => {
                copyText.textContent = 'COPY COMMAND TO A CLIPBOARD';
            }, 3000);
        }
    }

    async copyUrl() {
        const serializedCommand = btoa(JSON.stringify(this.getCurrentConfig()));
        const command = location.href.replace(location.hash, "") + "#" + serializedCommand;
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        const copyUrlText = document.getElementById('copyUrlText');

        try {
            await navigator.clipboard.writeText(command);
            copyUrlBtn.classList.add('copying');
            copyUrlText.textContent = 'Copied!';

            setTimeout(() => {
                copyUrlBtn.classList.remove('copying');
                copyUrlText.textContent = 'COPY URL WITH THIS CONFIG';
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

            copyUrlText.textContent = 'URL Copied!';
            setTimeout(() => {
                copyUrlText.textContent = 'COPY URL WITH THIS CONFIG';
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
                'requestFileScope': 'requestFileScope',
                'burpFile': 'burpFile',
                'level': 'level',
                'risk': 'risk',
                'randomAgent': 'randomAgent',
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
                '--method': 'method',
                '--data': 'data',
                '--param-del': 'paramDel',
                '--host': 'host',
                '-A': 'userAgent',
                '--mobile': 'mobileUserAgent',
                '--random-agent': 'randomAgent',
                '--referer': 'referer',
                '-H': 'headers',
                '--cookie': 'cookie',
                '--cookie-del': 'cookieDel',
                '--live-cookies': 'cookieLive',
                '--drop-set-cookie': 'cookieDrop',
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
                '--current-user': 'currentUser',
                '--current-db': 'currentDb',
                '--dbs': 'dbs',
                '--tables': 'tables',
                '--columns': 'columns',
                '--schema': 'schema',
                '--dump-all': 'dumpAll',
                '-D': 'database',
                '-T': 'table',
                '-C': 'column',
                '--null-connection': 'nullConnection',
                '-o': 'optimize',
                '--tamper': 'tamper',
                '--prefix': 'prefix',
                '--suffix': 'suffix',
                '--csrf-token': 'csrfToken',
                '--csrf-url': 'csrfUrl',
                '--second-url': 'secondUrl'
            };
            
            const elementId = paramMapping[param];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value === true;
                    } else if (param === '--technique') {
                        // Handle technique checkboxes
                        ['B', 'E', 'U', 'S', 'T'].forEach(tech => {
                            const techElement = document.getElementById('tech' + tech);
                            if (techElement) {
                                techElement.checked = value.includes(tech);
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

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
        this.updateCommand();
    }

    setupEventListeners() {
        // Copy button
        document.getElementById('copyBtn').addEventListener('click', () => this.copyCommand());
        
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
        
        // User-Agent custom field toggle
        document.getElementById('userAgent').addEventListener('change', (e) => {
            const customGroup = document.getElementById('customUserAgentGroup');
            if (e.target.value === 'custom') {
                customGroup.style.display = 'block';
            } else {
                customGroup.style.display = 'none';
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
        });

        // Risk slider
        const riskSlider = document.getElementById('risk');
        const riskValue = document.getElementById('riskValue');
        riskSlider.addEventListener('input', (e) => {
            riskValue.textContent = e.target.value;
        });

        // Verbose slider
        const verboseSlider = document.getElementById('verbose');
        const verboseValue = document.getElementById('verboseValue');
        verboseSlider.addEventListener('input', (e) => {
            verboseValue.textContent = e.target.value;
            let verboseLevelHelp = "";
            switch (document.getElementById('verbose').value) {
                case "0":
                    verboseLevelHelp = "0: Show only Python tracebacks, error and critical messages."; break;
                case "1":
                    verboseLevelHelp = "1: Show also information and warning messages (default)."; break;
                case "2":
                    verboseLevelHelp = "2: Show also debug messages."; break;
                case "3":
                    verboseLevelHelp = "3: Show also payloads injected."; break;
                case "4":
                    verboseLevelHelp = "4: Show also HTTP requests."; break;
                case "5":
                    verboseLevelHelp = "5: Show also HTTP responses' headers."; break;
                case "6":
                    verboseLevelHelp = "6: Show also HTTP responses' page content."; break;
            }
            document.getElementById('verbose-help').textContent = verboseLevelHelp;
        });

        
    }

    getCurrentConfig() {
        const config = {};
        
        // Target options
        const url = document.getElementById('url').value.trim();
        if (url) config['-u'] = url;
        
        const method = document.getElementById('method').value;
        if (method) config['--method'] = method;
        
        const data = document.getElementById('data').value.trim();
        if (data) config['--data'] = data;
        
        const requestFile = document.getElementById('requestFile').value.trim();
        if (requestFile) config['-r'] = requestFile;
        
        const targetsFile = document.getElementById('targetsFile').value.trim();
        if (targetsFile) config['-m'] = targetsFile;
        
        const directDb = document.getElementById('directDb').value.trim();
        if (directDb) config['-d'] = directDb;
        
        const googleDork = document.getElementById('googleDork').value.trim();
        if (googleDork) config['-g'] = googleDork;
        
        if (document.getElementById('forceSsl').checked) config['--force-ssl'] = true;
        
        // Request options
        const userAgent = document.getElementById('userAgent').value;
        if (userAgent && userAgent !== 'custom') {
            config['-A'] = userAgent;
        } else if (userAgent === 'custom') {
            const customUserAgent = document.getElementById('customUserAgent').value.trim();
            if (customUserAgent) config['-A'] = customUserAgent;
        }
        
        const headers = document.getElementById('headers').value.trim();
        if (headers) config['-H'] = headers;
        
        const cookie = document.getElementById('cookie').value.trim();
        if (cookie) config['--cookie'] = cookie;
        
        const referer = document.getElementById('referer').value.trim();
        if (referer) config['--referer'] = referer;
        
        const proxy = document.getElementById('proxy').value.trim();
        if (proxy) config['--proxy'] = proxy;
        
        const timeout = document.getElementById('timeout').value;
        if (timeout) config['--timeout'] = timeout;
        
        const delay = document.getElementById('delay').value;
        if (delay) config['--delay'] = delay;
        
        if (document.getElementById('randomAgent').checked) config['--random-agent'] = true;
        
        // Injection options
        const testParams = document.getElementById('testParams').value.trim();
        if (testParams) config['-p'] = testParams;
        
        const skipParams = document.getElementById('skipParams').value.trim();
        if (skipParams) config['--skip'] = skipParams;
        
        const level = document.getElementById('level').value;
        if (level > 1) config['--level'] = level;
        
        const risk = document.getElementById('risk').value;
        if (risk > 1) config['--risk'] = risk;
        
        const dbms = document.getElementById('dbms').value;
        if (dbms) config['--dbms'] = dbms;
        
        const os = document.getElementById('os').value;
        if (os) config['--os'] = os;
        
        // Techniques
        const techniques = [];
        if (document.getElementById('techB').checked) techniques.push('B');
        if (document.getElementById('techE').checked) techniques.push('E');
        if (document.getElementById('techU').checked) techniques.push('U');
        if (document.getElementById('techS').checked) techniques.push('S');
        if (document.getElementById('techT').checked) techniques.push('T');
        if (document.getElementById('techQ').checked) techniques.push('Q');
        if (techniques.length > 0) config['--technique'] = techniques.join('');
        
        // Detection options
        if (document.getElementById('batch').checked) config['--batch'] = true;
        
        const verbose = document.getElementById('verbose').value;
        if (verbose != 1) config['-v'] = verbose;
        
        const trafficFile = document.getElementById('trafficFile').value.trim();
        if (trafficFile) config['-t'] = trafficFile;
        
        if (document.getElementById('parseErrors').checked) config['--parse-errors'] = true;
        
        const testFilter = document.getElementById('testFilter').value.trim();
        if (testFilter) config['--test-filter'] = testFilter;
        
        // Enumeration options
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
        
        // Optimization options
        const threads = document.getElementById('threads').value;
        if (threads && threads > 1) config['--threads'] = threads;
        
        if (document.getElementById('keepAlive').checked) config['--keep-alive'] = true;
        if (document.getElementById('nullConnection').checked) config['--null-connection'] = true;
        if (document.getElementById('predictOutput').checked) config['--predict-output'] = true;
        if (document.getElementById('optimize').checked) config['-o'] = true;
        
        // Advanced options
        const tamper = document.getElementById('tamper').value.trim();
        if (tamper) config['--tamper'] = tamper;
        
        const prefix = document.getElementById('prefix').value.trim();
        if (prefix) config['--prefix'] = prefix;
        
        const suffix = document.getElementById('suffix').value.trim();
        if (suffix) config['--suffix'] = suffix;
        
        const csrfToken = document.getElementById('csrfToken').value.trim();
        if (csrfToken) config['--csrf-token'] = csrfToken;
        
        const csrfUrl = document.getElementById('csrfUrl').value.trim();
        if (csrfUrl) config['--csrf-url'] = csrfUrl;
        
        const secondUrl = document.getElementById('secondUrl').value.trim();
        if (secondUrl) config['--second-url'] = secondUrl;
        
        return config;
    }

    generateCommand() {
        const config = this.getCurrentConfig();
        let command = 'sqlmap';
        
        // Order of parameters for better readability
        const paramOrder = [
            '-u', '--method', '--data', '-r', '-m', '-d', '-g', '--force-ssl',
            '-A', '-H', '--cookie', '--referer', '--proxy', '--timeout', '--delay', '--random-agent',
            '-p', '--skip', '--level', '--risk', '--dbms', '--os', '--technique',
            '--batch', '-v', '-t', '--parse-errors', '--test-filter',
            '--current-user', '--current-db', '--dbs', '--tables', '--columns', '--schema', '--dump-all',
            '-D', '-T', '-C',
            '--threads', '--keep-alive', '--null-connection', '--predict-output', '-o',
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
                    if (value.includes(' ') || value.includes('&') || value.includes('=')) {
                        command += ` ${param} "${value}"`;
                    } else {
                        command += ` ${param} ${value}`;
                    }
                }
            }
        });
        
        return command;
    }

    updateCommand() {
        const command = this.generateCommand();
        const commandOutput = document.getElementById('commandOutput');
        commandOutput.textContent = command;
        
        // Add syntax highlighting
        this.applySyntaxHighlighting(commandOutput);
    }

    applySyntaxHighlighting(element) {
        /* BUG 
        let html = element.textContent;
        
        // Highlight options (starting with -)
        html = html.replace(/(--?[\w-]+)/g, '<span class="option">$1</span>');
        
        // Highlight quoted values
        html = html.replace(/"([^"]+)"/g, '"<span class="value">$1</span>"');
        
        // Highlight sqlmap command
        html = html.replace(/^sqlmap/, '<span class="flag">sqlmap</span>');
        
        element.innerHTML = html;
        */
    }

    async copyCommand() {
        const command = this.generateCommand();
        const copyBtn = document.getElementById('copyBtn');
        const copyText = document.getElementById('copyText');
        
        try {
            await navigator.clipboard.writeText(command);
            copyBtn.classList.add('copying');
            copyText.textContent = 'Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copying');
                copyText.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = command;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyText.textContent = 'Copied!';
            setTimeout(() => {
                copyText.textContent = 'Copy';
            }, 2000);
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
                '--method': 'method',
                '--data': 'data',
                '-r': 'requestFile',
                '-m': 'targetsFile',
                '-d': 'directDb',
                '-g': 'googleDork',
                '--force-ssl': 'forceSsl',
                '-A': 'userAgent',
                '-H': 'headers',
                '--cookie': 'cookie',
                '--referer': 'referer',
                '--proxy': 'proxy',
                '--timeout': 'timeout',
                '--delay': 'delay',
                '--random-agent': 'randomAgent',
                '-p': 'testParams',
                '--skip': 'skipParams',
                '--level': 'level',
                '--risk': 'risk',
                '--dbms': 'dbms',
                '--os': 'os',
                '--technique': 'technique',
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
                '--threads': 'threads',
                '--keep-alive': 'keepAlive',
                '--null-connection': 'nullConnection',
                '--predict-output': 'predictOutput',
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
                    } else {
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
        document.getElementById('customUserAgentGroup').style.display = 'none';
        
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
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SQLMapGenerator();
});
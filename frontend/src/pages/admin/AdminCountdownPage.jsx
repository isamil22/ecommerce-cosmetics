import React, { useState, useEffect } from 'react';
import { getCountdown, saveCountdown } from '../../api/apiService';

const AdminCountdownPage = () => {
    // Basic Settings
    const [title, setTitle] = useState('');
    const [endDate, setEndDate] = useState('');
    const [enabled, setEnabled] = useState(false);
    
    // Color Settings
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [textColor, setTextColor] = useState('#ffffff');
    const [borderColor, setBorderColor] = useState('#ff6b6b');
    const [timerBoxColor, setTimerBoxColor] = useState('#ffffff');
    const [timerTextColor, setTimerTextColor] = useState('#000000');
    const [urgentBgColor, setUrgentBgColor] = useState('#fef2f2');
    const [urgentTextColor, setUrgentTextColor] = useState('#dc2626');
    
    // Text Settings
    const [subtitle, setSubtitle] = useState('');
    const [urgentMessage, setUrgentMessage] = useState('');
    const [expiredMessage, setExpiredMessage] = useState('');
    const [packName, setPackName] = useState('');
    
    // Display Settings
    const [showDays, setShowDays] = useState(false);
    const [showHours, setShowHours] = useState(true);
    const [showMinutes, setShowMinutes] = useState(true);
    const [showSeconds, setShowSeconds] = useState(true);
    const [showPackName, setShowPackName] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(true);
    
    // Animation Settings
    const [enablePulse, setEnablePulse] = useState(true);
    const [enableBounce, setEnableBounce] = useState(true);
    const [urgentThreshold, setUrgentThreshold] = useState(3600); // 1 hour in seconds
    
    // Layout Settings
    const [borderRadius, setBorderRadius] = useState(12);
    const [padding, setPadding] = useState(16);
    const [fontSize, setFontSize] = useState(18);
    const [timerFontSize, setTimerFontSize] = useState(24);
    
    // Default Design Toggle
    const [useDefaultDesign, setUseDefaultDesign] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('darkPremium');
    
    const [message, setMessage] = useState('');

    // Multiple Design Presets for Website Compatibility
    const designPresets = {
        // 1. DARK PREMIUM THEME (Original Beautiful Design)
        darkPremium: {
            title: '🔥 عرض حصري محدود! / EXCLUSIVE Limited Offer!',
            subtitle: '💎 وفر حتى 70% - العرض ينتهي قريباً! / Save up to 70% - Offer ends soon!',
            packName: 'عروض VIP الحصرية / VIP Exclusive Offers',
            urgentMessage: '⚡ أسرع! أقل من ساعة متبقية! / ⚡ Hurry! Less than 1 hour left!',
            expiredMessage: 'انتهت الفترة المحدودة! شكراً لاهتمامكم / Limited Time Expired! Thank you for your interest',
            backgroundColor: '#1a1a2e', // Deep dark blue-purple
            textColor: '#ffffff', // Pure white text
            borderColor: '#ff6b6b', // Vibrant coral red border
            timerBoxColor: '#16213e', // Dark blue timer boxes
            timerTextColor: '#ffd700', // Gold timer numbers
            urgentBgColor: '#ff4757', // Bright red urgent background
            urgentTextColor: '#ffffff', // White urgent text
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            showPackName: true,
            showSubtitle: true,
            enablePulse: true,
            enableBounce: true,
            urgentThreshold: 1800,
            borderRadius: 20,
            padding: 24,
            fontSize: 20,
            timerFontSize: 32,
        },
        
        // 2. LIGHT PROFESSIONAL THEME (Website Compatible)
        lightProfessional: {
            title: '🔥 عرض محدود! / Limited Offer!',
            subtitle: '💰 وفر الآن قبل انتهاء العرض / Save now before offer ends',
            packName: 'عروض اليوم الخاصة / Today\'s Special Offers',
            urgentMessage: '⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out',
            expiredMessage: 'انتهت الفترة المحدودة! / Limited Time Expired!',
            backgroundColor: '#ffffff', // Clean white background
            textColor: '#1f2937', // Dark gray text
            borderColor: '#3b82f6', // Professional blue border
            timerBoxColor: '#f8fafc', // Light gray timer boxes
            timerTextColor: '#1f2937', // Dark gray timer numbers
            urgentBgColor: '#fef2f2', // Light red urgent background
            urgentTextColor: '#dc2626', // Red urgent text
            showDays: false,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            showPackName: true,
            showSubtitle: true,
            enablePulse: true,
            enableBounce: false,
            urgentThreshold: 3600,
            borderRadius: 12,
            padding: 20,
            fontSize: 18,
            timerFontSize: 28,
        },
        
        // 3. MODERN GRADIENT THEME (Contemporary)
        modernGradient: {
            title: '⚡ عرض سريع! / Flash Sale!',
            subtitle: '🎯 لا تفوت الفرصة! / Don\'t miss out!',
            packName: 'عروض البرق / Lightning Deals',
            urgentMessage: '🚨 آخر ساعات! / Last hours!',
            expiredMessage: 'انتهى العرض! / Sale ended!',
            backgroundColor: '#667eea', // Modern blue-purple
            textColor: '#ffffff', // White text
            borderColor: '#f093fb', // Pink gradient border
            timerBoxColor: '#764ba2', // Purple timer boxes
            timerTextColor: '#ffffff', // White timer numbers
            urgentBgColor: '#ff6b6b', // Coral urgent background
            urgentTextColor: '#ffffff', // White urgent text
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            showPackName: true,
            showSubtitle: true,
            enablePulse: true,
            enableBounce: true,
            urgentThreshold: 1800,
            borderRadius: 16,
            padding: 22,
            fontSize: 19,
            timerFontSize: 30,
        },
        
        // 4. ELEGANT MINIMAL THEME (Clean & Simple)
        elegantMinimal: {
            title: '✨ عرض خاص / Special Offer',
            subtitle: '🎁 هدية لك! / Gift for you!',
            packName: 'عروض أنيقة / Elegant Offers',
            urgentMessage: '⏰ وقت محدود! / Limited time!',
            expiredMessage: 'انتهى العرض الأنيق! / Elegant offer ended!',
            backgroundColor: '#f8fafc', // Very light gray
            textColor: '#374151', // Medium gray text
            borderColor: '#d1d5db', // Light gray border
            timerBoxColor: '#ffffff', // White timer boxes
            timerTextColor: '#1f2937', // Dark gray timer numbers
            urgentBgColor: '#fef3c7', // Light yellow urgent background
            urgentTextColor: '#d97706', // Orange urgent text
            showDays: false,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            showPackName: true,
            showSubtitle: true,
            enablePulse: false,
            enableBounce: false,
            urgentThreshold: 3600,
            borderRadius: 8,
            padding: 16,
            fontSize: 16,
            timerFontSize: 24,
        },
        
        // 5. VIBRANT ENERGY THEME (High Energy)
        vibrantEnergy: {
            title: '🚀 عرض صاروخي! / Rocket Sale!',
            subtitle: '💥 انفجار العروض! / Explosive deals!',
            packName: 'عروض الطاقة / Energy Deals',
            urgentMessage: '🔥 نار! نار! / Fire! Fire!',
            expiredMessage: 'انفجر العرض! / Deal exploded!',
            backgroundColor: '#ff6b6b', // Vibrant coral
            textColor: '#ffffff', // White text
            borderColor: '#ffd700', // Gold border
            timerBoxColor: '#ff4757', // Bright red timer boxes
            timerTextColor: '#ffffff', // White timer numbers
            urgentBgColor: '#ffd700', // Gold urgent background
            urgentTextColor: '#1a1a2e', // Dark urgent text
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            showPackName: true,
            showSubtitle: true,
            enablePulse: true,
            enableBounce: true,
            urgentThreshold: 900, // 15 minutes for high energy
            borderRadius: 25,
            padding: 28,
            fontSize: 22,
            timerFontSize: 36,
        }
    };

    // Default Design Preset (Dark Premium)
    const defaultDesignPreset = designPresets.darkPremium;

    // Function to apply selected theme
    const applySelectedTheme = (themeKey) => {
        const theme = designPresets[themeKey];
        if (!theme) return;
        
        setTitle(theme.title);
        setSubtitle(theme.subtitle);
        setPackName(theme.packName);
        setUrgentMessage(theme.urgentMessage);
        setExpiredMessage(theme.expiredMessage);
        
        setBackgroundColor(theme.backgroundColor);
        setTextColor(theme.textColor);
        setBorderColor(theme.borderColor);
        setTimerBoxColor(theme.timerBoxColor);
        setTimerTextColor(theme.timerTextColor);
        setUrgentBgColor(theme.urgentBgColor);
        setUrgentTextColor(theme.urgentTextColor);
        
        setShowDays(theme.showDays);
        setShowHours(theme.showHours);
        setShowMinutes(theme.showMinutes);
        setShowSeconds(theme.showSeconds);
        setShowPackName(theme.showPackName);
        setShowSubtitle(theme.showSubtitle);
        
        setEnablePulse(theme.enablePulse);
        setEnableBounce(theme.enableBounce);
        setUrgentThreshold(theme.urgentThreshold);
        
        setBorderRadius(theme.borderRadius);
        setPadding(theme.padding);
        setFontSize(theme.fontSize);
        setTimerFontSize(theme.timerFontSize);
    };

    // Function to apply default design (backward compatibility)
    const applyDefaultDesign = () => {
        applySelectedTheme(selectedTheme);
    };

    // Handle default design toggle
    const handleDefaultDesignToggle = (checked) => {
        setUseDefaultDesign(checked);
        if (checked) {
            applyDefaultDesign();
        }
    };

    useEffect(() => {
        getCountdown().then(response => {
            if (response.data) {
                const data = response.data;
                // Basic Settings
                setTitle(data.title || '');
                setEndDate(data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '');
                setEnabled(data.enabled || false);
                
                // Color Settings
                setBackgroundColor(data.backgroundColor || '#fef3c7');
                setTextColor(data.textColor || '#ea580c');
                setBorderColor(data.borderColor || '#f97316');
                setTimerBoxColor(data.timerBoxColor || '#ffffff');
                setTimerTextColor(data.timerTextColor || '#ea580c');
                setUrgentBgColor(data.urgentBgColor || '#fef2f2');
                setUrgentTextColor(data.urgentTextColor || '#dc2626');
                
                // Text Settings
                setSubtitle(data.subtitle || '');
                setUrgentMessage(data.urgentMessage || '');
                setExpiredMessage(data.expiredMessage || '');
                setPackName(data.packName || '');
                
                // Display Settings
                setShowDays(data.showDays || false);
                setShowHours(data.showHours !== undefined ? data.showHours : true);
                setShowMinutes(data.showMinutes !== undefined ? data.showMinutes : true);
                setShowSeconds(data.showSeconds !== undefined ? data.showSeconds : true);
                setShowPackName(data.showPackName !== undefined ? data.showPackName : true);
                setShowSubtitle(data.showSubtitle !== undefined ? data.showSubtitle : true);
                
                // Animation Settings
                setEnablePulse(data.enablePulse !== undefined ? data.enablePulse : true);
                setEnableBounce(data.enableBounce !== undefined ? data.enableBounce : true);
                setUrgentThreshold(data.urgentThreshold || 3600);
                
                // Layout Settings
                setBorderRadius(data.borderRadius || 12);
                setPadding(data.padding || 16);
                setFontSize(data.fontSize || 18);
                setTimerFontSize(data.timerFontSize || 24);
                
                // Default Design Setting
                setUseDefaultDesign(data.useDefaultDesign || false);
            }
        }).catch(error => console.error("Could not fetch countdown settings", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const countdownData = {
            // Basic Settings
            title,
            endDate: new Date(endDate).toISOString(),
            enabled,
            
            // Color Settings
            backgroundColor,
            textColor,
            borderColor,
            timerBoxColor,
            timerTextColor,
            urgentBgColor,
            urgentTextColor,
            
            // Text Settings
            subtitle,
            urgentMessage,
            expiredMessage,
            packName,
            
            // Display Settings
            showDays,
            showHours,
            showMinutes,
            showSeconds,
            showPackName,
            showSubtitle,
            
            // Animation Settings
            enablePulse,
            enableBounce,
            urgentThreshold,
            
            // Layout Settings
            borderRadius,
            padding,
            fontSize,
            timerFontSize,
            
            // Default Design Setting
            useDefaultDesign,
        };
        saveCountdown(countdownData)
            .then(() => {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(() => {
                setMessage('Error saving settings.');
                setTimeout(() => setMessage(''), 3000);
            });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">🎛️ Full Countdown Control Panel</h1>
            {message && <p className="text-blue-500">{message}</p>}
            
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
                
                        {/* Design Theme Selector */}
                        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border-2 border-purple-200">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">🎨 WEBSITE-COMPATIBLE DESIGN THEMES</h2>
                            
                            {/* Theme Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Choose a Design Theme:</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Dark Premium Theme */}
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedTheme === 'darkPremium' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`} onClick={() => setSelectedTheme('darkPremium')}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-4 h-4 rounded-full bg-gray-800 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-red-400"></div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">🌙 Dark Premium</h3>
                                        <p className="text-sm text-gray-600">Luxury dark theme with gold accents</p>
                                    </div>
                                    
                                    {/* Light Professional Theme */}
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedTheme === 'lightProfessional' 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`} onClick={() => setSelectedTheme('lightProfessional')}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-4 h-4 rounded-full bg-white border border-gray-300 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">☀️ Light Professional</h3>
                                        <p className="text-sm text-gray-600">Clean white theme for business sites</p>
                                    </div>
                                    
                                    {/* Modern Gradient Theme */}
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedTheme === 'modernGradient' 
                                            ? 'border-pink-500 bg-pink-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`} onClick={() => setSelectedTheme('modernGradient')}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-purple-400 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-pink-400"></div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">🌈 Modern Gradient</h3>
                                        <p className="text-sm text-gray-600">Contemporary gradient design</p>
                                    </div>
                                    
                                    {/* Elegant Minimal Theme */}
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedTheme === 'elegantMinimal' 
                                            ? 'border-gray-500 bg-gray-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`} onClick={() => setSelectedTheme('elegantMinimal')}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">✨ Elegant Minimal</h3>
                                        <p className="text-sm text-gray-600">Clean and simple design</p>
                                    </div>
                                    
                                    {/* Vibrant Energy Theme */}
                                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedTheme === 'vibrantEnergy' 
                                            ? 'border-red-500 bg-red-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`} onClick={() => setSelectedTheme('vibrantEnergy')}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                                            <div className="w-4 h-4 rounded-full bg-orange-400"></div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">🚀 Vibrant Energy</h3>
                                        <p className="text-sm text-gray-600">High-energy colorful design</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Apply Theme Button */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-gray-700 mb-2">
                                        <strong>Apply the selected theme instantly!</strong>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        This will set all colors, text, animations, and layout to match your website's style and branding.
                                    </p>
                                </div>
                                <div className="ml-6">
                                    <button 
                                        type="button"
                                        onClick={() => applySelectedTheme(selectedTheme)}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                                    >
                                        🎨 Apply {selectedTheme === 'darkPremium' ? 'Dark Premium' : 
                                                 selectedTheme === 'lightProfessional' ? 'Light Professional' :
                                                 selectedTheme === 'modernGradient' ? 'Modern Gradient' :
                                                 selectedTheme === 'elegantMinimal' ? 'Elegant Minimal' :
                                                 'Vibrant Energy'} Theme
                                    </button>
                                </div>
                            </div>
                            
                            {/* Theme Preview */}
                            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-2">🎯 Selected Theme Preview:</h4>
                                <div className="text-sm text-gray-600">
                                    {selectedTheme === 'darkPremium' && (
                                        <div>
                                            <p>🌙 <strong>Dark Premium:</strong> Deep dark blue-purple background with gold timer numbers and coral borders</p>
                                            <p>Perfect for luxury brands and premium products</p>
                                        </div>
                                    )}
                                    {selectedTheme === 'lightProfessional' && (
                                        <div>
                                            <p>☀️ <strong>Light Professional:</strong> Clean white background with professional blue accents</p>
                                            <p>Perfect for business websites and corporate brands</p>
                                        </div>
                                    )}
                                    {selectedTheme === 'modernGradient' && (
                                        <div>
                                            <p>🌈 <strong>Modern Gradient:</strong> Blue-purple gradient with pink accents</p>
                                            <p>Perfect for modern, trendy websites</p>
                                        </div>
                                    )}
                                    {selectedTheme === 'elegantMinimal' && (
                                        <div>
                                            <p>✨ <strong>Elegant Minimal:</strong> Light gray background with subtle accents</p>
                                            <p>Perfect for minimalist and clean designs</p>
                                        </div>
                                    )}
                                    {selectedTheme === 'vibrantEnergy' && (
                                        <div>
                                            <p>🚀 <strong>Vibrant Energy:</strong> Bright coral background with gold accents</p>
                                            <p>Perfect for energetic brands and flash sales</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                
                {/* Basic Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📝 Basic Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} 
                                   placeholder="🔥 عرض محدود! / Limited Offer!" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date & Time</label>
                            <input type="datetime-local" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                            <input type="text" id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} 
                                   placeholder="💰 وفر الآن قبل انتهاء العرض / Save now before offer ends" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="packName" className="block text-sm font-medium text-gray-700">Pack/Product Name</label>
                            <input type="text" id="packName" value={packName} onChange={e => setPackName(e.target.value)} 
                                   placeholder="عروض اليوم الخاصة / Today's Special Offers" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="urgentMessage" className="block text-sm font-medium text-gray-700">Urgent Message</label>
                            <input type="text" id="urgentMessage" value={urgentMessage} onChange={e => setUrgentMessage(e.target.value)} 
                                   placeholder="⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="expiredMessage" className="block text-sm font-medium text-gray-700">Expired Message</label>
                            <input type="text" id="expiredMessage" value={expiredMessage} onChange={e => setExpiredMessage(e.target.value)} 
                                   placeholder="انتهت الفترة المحدودة! / Limited Time Expired!" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="enabled" checked={enabled} onChange={e => setEnabled(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">Enable Countdown</label>
                        </div>
                    </div>
                </div>

                {/* Color Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">🎨 Color Settings</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">Background</label>
                            <input type="color" id="backgroundColor" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">Text Color</label>
                            <input type="color" id="textColor" value={textColor} onChange={e => setTextColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="borderColor" className="block text-sm font-medium text-gray-700">Border Color</label>
                            <input type="color" id="borderColor" value={borderColor} onChange={e => setBorderColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="timerBoxColor" className="block text-sm font-medium text-gray-700">Timer Box</label>
                            <input type="color" id="timerBoxColor" value={timerBoxColor} onChange={e => setTimerBoxColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="timerTextColor" className="block text-sm font-medium text-gray-700">Timer Text</label>
                            <input type="color" id="timerTextColor" value={timerTextColor} onChange={e => setTimerTextColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="urgentBgColor" className="block text-sm font-medium text-gray-700">Urgent Background</label>
                            <input type="color" id="urgentBgColor" value={urgentBgColor} onChange={e => setUrgentBgColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                            <label htmlFor="urgentTextColor" className="block text-sm font-medium text-gray-700">Urgent Text</label>
                            <input type="color" id="urgentTextColor" value={urgentTextColor} onChange={e => setUrgentTextColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">👁️ Display Settings</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="showDays" checked={showDays} onChange={e => setShowDays(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showDays" className="ml-2 block text-sm text-gray-900">Show Days</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showHours" checked={showHours} onChange={e => setShowHours(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showHours" className="ml-2 block text-sm text-gray-900">Show Hours</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showMinutes" checked={showMinutes} onChange={e => setShowMinutes(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showMinutes" className="ml-2 block text-sm text-gray-900">Show Minutes</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showSeconds" checked={showSeconds} onChange={e => setShowSeconds(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showSeconds" className="ml-2 block text-sm text-gray-900">Show Seconds</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showPackName" checked={showPackName} onChange={e => setShowPackName(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showPackName" className="ml-2 block text-sm text-gray-900">Show Pack Name</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showSubtitle" checked={showSubtitle} onChange={e => setShowSubtitle(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showSubtitle" className="ml-2 block text-sm text-gray-900">Show Subtitle</label>
                        </div>
                    </div>
                </div>

                {/* Animation Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Animation Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="enablePulse" checked={enablePulse} onChange={e => setEnablePulse(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="enablePulse" className="ml-2 block text-sm text-gray-900">Enable Pulse Animation</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="enableBounce" checked={enableBounce} onChange={e => setEnableBounce(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="enableBounce" className="ml-2 block text-sm text-gray-900">Enable Bounce Animation</label>
                </div>
                <div>
                            <label htmlFor="urgentThreshold" className="block text-sm font-medium text-gray-700">Urgent Threshold (seconds)</label>
                            <input type="number" id="urgentThreshold" value={urgentThreshold} onChange={e => setUrgentThreshold(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                    </div>
                </div>

                {/* Layout Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📐 Layout Settings</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="borderRadius" className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
                            <input type="number" id="borderRadius" value={borderRadius} onChange={e => setBorderRadius(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="padding" className="block text-sm font-medium text-gray-700">Padding (px)</label>
                            <input type="number" id="padding" value={padding} onChange={e => setPadding(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size (px)</label>
                            <input type="number" id="fontSize" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="timerFontSize" className="block text-sm font-medium text-gray-700">Timer Font Size (px)</label>
                            <input type="number" id="timerFontSize" value={timerFontSize} onChange={e => setTimerFontSize(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <button type="submit" className="w-full bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 text-lg font-semibold">
                        💾 Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCountdownPage;
//by kafu
Java.perform(function() {
    console.log('');
    console.log('======================================');
    console.log('    Memulai Spoofing Device Info');
    console.log('======================================');
    console.log('');
    const FAKE_VALUES = {
        android_id: "1234567890abcdef",
        phone: "1234567890",
        imei: "123456789012345",
        imsi: "123456789012345",
        iccid: "89123456789012345678",
        mac: [0x00, 0x11, 0x22, 0x33, 0x44, 0x55],
        ip: "192.168.1.100",
        
        location: {
            latitude: -6.2088,
            longitude: 106.8456,
            altitude: 100.0,
            accuracy: 10.0,
            speed: 0.0,
            bearing: 0.0
        },
        
        advertising_id: "38400000-8cf0-11bd-b23e-10b96e40000d",
        build_props: {
            BRAND: "samsung",
            MODEL: "SM-G998B",
            MANUFACTURER: "Samsung",
            PRODUCT: "p3s",
            DEVICE: "p3s",
            FINGERPRINT: "samsung/p3sxxx/p3s:13/TP1A.220624.014/G998BXXS9EWK1:user/release-keys",
            HARDWARE: "exynos2100",
            BOARD: "exynos2100"
        },       
        
        system_info: {
            build_number: "G998BXXS9EWK1",
            id: "TP1A.220624.014",
            time: 1640995200000,
            timezone: "Asia/Jakarta",
            bootloader: "G998BXXS9EWK1",
            host: "SRPVK24B003",
            user: "dpi",
            type: "user",
            tags: "release-keys",
            locale: "in-ID",
            kernel_version: "4.19.157-perf+",
            security_patch: "2023-12-01",
            build_date: "Wed Dec 1 12:00:00 WIB 2023",
            build_description: "samsung/p3sxxx/p3s:13/TP1A.220624.014/G998BXXS9EWK1:user/release-keys"
    },   
    
        display: {
            width: 1440,
            height: 3200,
            density: 3.0,
            dpi: 480,
            scaled_density: 3.0,
            xdpi: 480,
            ydpi: 480,
            refresh_rate: 120.0
    }   
 };
    function spoofAndroidID() {
        try {
            const ss = Java.use("android.provider.Settings$Secure");
            ss.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(context, param) {
                if (param === ss.ANDROID_ID.value) {
                    console.log('ubah android ID : ' + FAKE_VALUES.android_id);
                    return FAKE_VALUES.android_id;
                }
                return this.getString(context, param);
            };
        } catch (error) {
            console.log('Error dalam spoofing Android ID:', error);
        }
    }

    function spoofPhone() {
        try {
            const tm = Java.use("android.telephony.TelephonyManager");
            if (tm.getLine1Number) {
                tm.getLine1Number.overload().implementation = function() {
                    console.log('Mengubah Nomor Telepon menjadi: ' + FAKE_VALUES.phone);
                    return FAKE_VALUES.phone;
                };
            }
        } catch (error) {
            console.log(' Error dalam spoofing Phone Number:', error);
        }
    }

    function spoofIMEI() {
        try {
            const tm = Java.use("android.telephony.TelephonyManager");
            const sdkVersion = Java.use('android.os.Build$VERSION').SDK_INT.value;
            if (sdkVersion < 29) {
                if (tm.getDeviceId) {
                    tm.getDeviceId.overload().implementation = function() {
                        console.log(' Mengubah IMEI (getDeviceId) menjadi: ' + FAKE_VALUES.imei);
                        return FAKE_VALUES.imei;
                    };
                }
                if (tm.getDeviceId.overload("int")) {
                    tm.getDeviceId.overload("int").implementation = function(slotIndex) {
                        console.log(' Mengubah IMEI (getDeviceId dengan slot) menjadi: ' + FAKE_VALUES.imei);
                        return FAKE_VALUES.imei;
                    };
                }
            }
            if (sdkVersion >= 26) {
                if (tm.getImei) {
                    tm.getImei.overload().implementation = function() {
                        console.log(' Mengubah IMEI (getImei) menjadi: ' + FAKE_VALUES.imei);
                        return FAKE_VALUES.imei;
                    };
                    if (tm.getImei.overload("int")) {
                        tm.getImei.overload("int").implementation = function(slotIndex) {
                            console.log(' Mengubah IMEI (getImei dengan slot) menjadi: ' + FAKE_VALUES.imei);
                            return FAKE_VALUES.imei;
                        };
                    }
                }
            }
        } catch (error) {
            console.log(' Error dalam spoofing IMEI:', error);
        }
    }

    function spoofIMSI() {
        try {
            const tm = Java.use("android.telephony.TelephonyManager");
            tm.getSubscriberId.overload().implementation = function() {
                console.log(' Mengubah IMSI menjadi: ' + FAKE_VALUES.imsi);
                return FAKE_VALUES.imsi;
            };
        } catch (error) {
            console.log(' Error dalam spoofing IMSI:', error);
        }
    }

    function spoofICCID() {
        try {
            const tm = Java.use("android.telephony.TelephonyManager");
            tm.getSimSerialNumber.overload().implementation = function() {
                console.log(' Mengubah ICCID menjadi: ' + FAKE_VALUES.iccid);
                return FAKE_VALUES.iccid;
            };
        } catch (error) {
            console.log(' Error dalam spoofing ICCID:', error);
        }
    }

    function spoofMAC() {
        try {
            const macString = FAKE_VALUES.mac.map(byte => 
                ('0' + (byte & 0xFF).toString(16)).slice(-2)
            ).join(':').toUpperCase();
            
            const mac = Java.array('byte', FAKE_VALUES.mac);
            console.log(' Mengubah MAC Address menjadi: ' + macString);
            
            const ni = Java.use("java.net.NetworkInterface");
            ni.getHardwareAddress.implementation = function() {
                return mac;
            };

            const wifiInfo = Java.use('android.net.wifi.WifiInfo');
            if (wifiInfo.getMacAddress) {
                wifiInfo.getMacAddress.implementation = function() {
                    return macString;
                };
            }
        } catch (error) {
            console.log(' Error dalam spoofing MAC Address:', error);
        }
    }

    function hideGSFID() {
        try {
            console.log(' Menyembunyikan Google Services Framework ID');
            const cr = Java.use("android.content.ContentResolver");
            
            const queryImplementation = function() {
                const uri = arguments[0];
                const originalResult = this.query.apply(this, arguments);
                
                if (uri.toString() === "content://com.google.android.gsf.gservices") {
                    return null;
                }
                return originalResult;
            };

            const queryOverloads = cr.query.overloads;
            queryOverloads.forEach(overload => {
                overload.implementation = queryImplementation;
            });
        } catch (error) {
            console.log(' Error dalam menyembunyikan GSFID:', error);
        }
    }

    function spoofIP() {
        try {
            const ip = FAKE_VALUES.ip;
            console.log(' Mengubah IP Address menjadi: ' + ip);

            const inetAddress = Java.use("java.net.InetAddress");
            inetAddress.getHostAddress.implementation = function() {
                return ip;
            };

            const wifiInfo = Java.use("android.net.wifi.WifiInfo");
            if (wifiInfo.getIpAddress) {
                wifiInfo.getIpAddress.implementation = function() {
                    const parts = ip.split(".");
                    return (parseInt(parts[3]) << 24) | 
                           (parseInt(parts[2]) << 16) | 
                           (parseInt(parts[1]) << 8) | 
                           parseInt(parts[0]);
                };
            }

            const networkInterface = Java.use("java.net.NetworkInterface");
            const vector = Java.use("java.util.Vector");
            networkInterface.getInetAddresses.implementation = function() {
                const fakeVector = vector.$new();
                const fakeInetAddress = inetAddress.getByName(ip);
                fakeVector.add(fakeInetAddress);
                return fakeVector.elements();
            };
        } catch (error) {
            console.log(' Error dalam spoofing IP Address:', error);
        }
    }

    
    function spoofLocation() {
    try {
        console.log(' Mengubah informasi lokasi');
        
        const Location = Java.use('android.location.Location');       
        Location.getLatitude.implementation = function() {
            return FAKE_VALUES.location.latitude;
        };        
        Location.getLongitude.implementation = function() {
            return FAKE_VALUES.location.longitude;
        };        
        Location.getAltitude.implementation = function() {
            return FAKE_VALUES.location.altitude;
        };        
        Location.getAccuracy.implementation = function() {
            return FAKE_VALUES.location.accuracy;
        };        
        Location.getSpeed.implementation = function() {
            return FAKE_VALUES.location.speed;
        };
        Location.getBearing.implementation = function() {
            return FAKE_VALUES.location.bearing;
        };

        const LocationManager = Java.use('android.location.LocationManager');
        LocationManager.getLastKnownLocation.overload('java.lang.String').implementation = function(provider) {
            const location = Location.$new(provider);
            return location;
        };
    } catch (error) {
        console.log(' Error dalam spoofing Location:', error);
    }
}

    function spoofAdvertisingId() {
        try {
            console.log(' Mengubah Google Advertising ID');
            const AdvertisingIdClient = Java.use('com.google.android.gms.ads.identifier.AdvertisingIdClient$Info');
            
            AdvertisingIdClient.getId.implementation = function() {
                return FAKE_VALUES.advertising_id;
            };
            
            AdvertisingIdClient.isLimitAdTrackingEnabled.implementation = function() {
                return false;
            };
        } catch (error) {
            console.log(' Error dalam spoofing Advertising ID:', error);
        }
    }

    function spoofBuildProps() {
        try {
            console.log(' Mengubah Build Properties');
            const Build = Java.use('android.os.Build');
            const VERSION = Java.use('android.os.Build$VERSION');
            
            Build.BRAND.value = FAKE_VALUES.build_props.BRAND;
            Build.MODEL.value = FAKE_VALUES.build_props.MODEL;
            Build.MANUFACTURER.value = FAKE_VALUES.build_props.MANUFACTURER;
            Build.PRODUCT.value = FAKE_VALUES.build_props.PRODUCT;
            Build.DEVICE.value = FAKE_VALUES.build_props.DEVICE;
            Build.FINGERPRINT.value = FAKE_VALUES.build_props.FINGERPRINT;
            Build.HARDWARE.value = FAKE_VALUES.build_props.HARDWARE;
            Build.BOARD.value = FAKE_VALUES.build_props.BOARD;
            
            const SystemProperties = Java.use('android.os.SystemProperties');
            
            SystemProperties.get.overload('java.lang.String').implementation = function(key) {
                switch(key) {
                    case "ro.build.fingerprint":
                        return FAKE_VALUES.build_props.FINGERPRINT;
                    case "ro.product.manufacturer":
                        return FAKE_VALUES.build_props.MANUFACTURER;
                    case "ro.product.model":
                        return FAKE_VALUES.build_props.MODEL;
                    case "ro.product.name":
                        return FAKE_VALUES.build_props.PRODUCT;
                    default:
                        return this.get(key);
                }
            };
        } catch (error) {
            console.log(' Error dalam spoofing Build Properties:', error);
        }
    }
    
    function spoofSystemInfo() {
    try {
        console.log(' Mengubah informasi sistem');
        const Build = Java.use('android.os.Build');
        const VERSION = Java.use('android.os.Build$VERSION');
        
        VERSION.SECURITY_PATCH.value = FAKE_VALUES.system_info.security_patch;
        const fields = VERSION.class.getDeclaredFields();
        fields.forEach(field => {
            if (field.getName() === "SECURITY_PATCH") {
                field.setAccessible(true);
                field.set(null, FAKE_VALUES.system_info.security_patch);
            }
        });

        VERSION.INCREMENTAL.value = FAKE_VALUES.system_info.build_number;
        Build.DISPLAY.value = FAKE_VALUES.system_info.build_number;
        const SystemProperties = Java.use('android.os.SystemProperties');
        SystemProperties.get.overload('java.lang.String').implementation = function(key) {
            switch (key) {
                case "ro.build.version.security_patch":
                    console.log(' Security Patch diubah menjadi: ' + FAKE_VALUES.system_info.security_patch);
                    return FAKE_VALUES.system_info.security_patch;
                case "ro.security.patch.level":
                    return FAKE_VALUES.system_info.security_patch;
                case "ro.build.version.incremental":
                    return FAKE_VALUES.system_info.build_number;
                case "ro.build.display.id":
                    return FAKE_VALUES.system_info.build_number;
                case "ro.build.id":
                    return FAKE_VALUES.system_info.id;
                case "ro.build.version.release":
                    return "13";
                case "ro.build.description":
                    return FAKE_VALUES.system_info.build_description;
                case "ro.build.fingerprint":
                    return FAKE_VALUES.build_props.FINGERPRINT;
                case "ro.build.date":
                    return FAKE_VALUES.system_info.build_date;
                case "ro.build.type":
                    return FAKE_VALUES.system_info.type;
                case "ro.build.tags":
                    return FAKE_VALUES.system_info.tags;
                case "ro.build.user":
                    return FAKE_VALUES.system_info.user;
                case "ro.build.host":
                    return FAKE_VALUES.system_info.host;
                default:
                    return this.get(key);
            }
        };

        Build.ID.value = FAKE_VALUES.system_info.id;
        Build.BOOTLOADER.value = FAKE_VALUES.system_info.bootloader;
        Build.HOST.value = FAKE_VALUES.system_info.host;
        Build.USER.value = FAKE_VALUES.system_info.user;
        Build.TYPE.value = FAKE_VALUES.system_info.type;
        Build.TAGS.value = FAKE_VALUES.system_info.tags;
        
        const settings = Java.use('android.provider.Settings$System');
        if (settings.getString) {
            settings.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function(resolver, name) {
                if (name === "ro.build.version.security_patch") {
                    return FAKE_VALUES.system_info.security_patch;
                }
                return this.getString(resolver, name);
            };
        }

        console.log(' System Info berhasil diubah');
        console.log(' Security Patch: ' + FAKE_VALUES.system_info.security_patch);
        console.log(' Build Number: ' + FAKE_VALUES.system_info.build_number);
    } catch (error) {
        console.log(' Error dalam spoofing System Info:', error);
        console.log(error.stack);
    }
}

function spoofDisplayMetrics() {
    try {
        console.log(' Mengubah ukuran layar dan densitas');
        
        const DisplayMetrics = Java.use('android.util.DisplayMetrics');
        const Resources = Java.use('android.content.res.Resources');
        const WindowManager = Java.use('android.view.WindowManager');
        const Display = Java.use('android.view.Display');
        if (Display.getMetrics) {
            Display.getMetrics.implementation = function(metrics) {
                this.getMetrics(metrics);
                metrics.widthPixels.value = FAKE_VALUES.display.width;
                metrics.heightPixels.value = FAKE_VALUES.display.height;
                metrics.density.value = FAKE_VALUES.display.density;
                metrics.densityDpi.value = FAKE_VALUES.display.dpi;
                metrics.scaledDensity.value = FAKE_VALUES.display.scaled_density;
                metrics.xdpi.value = FAKE_VALUES.display.xdpi;
                metrics.ydpi.value = FAKE_VALUES.display.ydpi;
            };
        }

        if (Display.getRealMetrics) {
            Display.getRealMetrics.implementation = function(metrics) {
                this.getRealMetrics(metrics);
                metrics.widthPixels.value = FAKE_VALUES.display.width;
                metrics.heightPixels.value = FAKE_VALUES.display.height;
                metrics.density.value = FAKE_VALUES.display.density;
                metrics.densityDpi.value = FAKE_VALUES.display.dpi;
                metrics.scaledDensity.value = FAKE_VALUES.display.scaled_density;
                metrics.xdpi.value = FAKE_VALUES.display.xdpi;
                metrics.ydpi.value = FAKE_VALUES.display.ydpi;
            };
        }
        Resources.getDisplayMetrics.implementation = function() {
            const metrics = this.getDisplayMetrics();
            metrics.widthPixels.value = FAKE_VALUES.display.width;
            metrics.heightPixels.value = FAKE_VALUES.display.height;
            metrics.density.value = FAKE_VALUES.display.density;
            metrics.densityDpi.value = FAKE_VALUES.display.dpi;
            metrics.scaledDensity.value = FAKE_VALUES.display.scaled_density;
            metrics.xdpi.value = FAKE_VALUES.display.xdpi;
            metrics.ydpi.value = FAKE_VALUES.display.ydpi;
            return metrics;
        };
        if (Display.getRefreshRate) {
            Display.getRefreshRate.implementation = function() {
                return FAKE_VALUES.display.refresh_rate;
            };
        }

        console.log(' Display Metrics berhasil diubah:');
        console.log(`    Resolution: ${FAKE_VALUES.display.width}x${FAKE_VALUES.display.height}`);
        console.log(`    Density: ${FAKE_VALUES.display.density} (${FAKE_VALUES.display.dpi} DPI)`);
        console.log(`    Refresh Rate: ${FAKE_VALUES.display.refresh_rate}Hz`);
    } catch (error) {
        console.log(' Error dalam spoofing Display Metrics:', error);
        console.log(error.stack);
    }
}
    
    try {
        spoofMAC();
        spoofICCID();
        spoofIMSI();
        spoofAndroidID();
        spoofIMEI();
        spoofPhone();
        hideGSFID();
        spoofIP();
        spoofLocation();
        spoofAdvertisingId();
        spoofBuildProps();
        spoofSystemInfo();
        spoofDisplayMetrics();
  
    } catch (error) {
        console.log('\n Error dalam proses spoofing:', error);
        console.log(' Beberapa fungsi mungkin tidak berjalan dengan benar\n');
    }
});

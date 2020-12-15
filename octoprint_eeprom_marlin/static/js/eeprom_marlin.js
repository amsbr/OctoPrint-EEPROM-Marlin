/**
* Created by Salandora on 27.07.2015.
* Modified by Anderson Silva on 20.08.2017.
* Contribution of CyberDracula on 15.08.2017.
*/
var hasChangedEepromForm = false;
$(function() {
    function EepromMarlinViewModel(parameters) {
        var self = this;
        self.execBackup = false;
        self.startBackup = false;
        self.backupConfig = "";
        self.stateControls = true;

        self.setRegExVars = function(version) {
            //console.log(version);
            // All versions
            self.eepromM501RegEx = /M501/;
            self.eepromOKRegEx = /ok/;
            self.eepromM92RegEx = /M92 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;//Steps per unit
            self.eepromM200RegEx = /M200 ([D])(.*)/;//Filament settings
            self.eepromM201RegEx = /M201 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;//Maximum Acceleration (units/s2)
            self.eepromM203RegEx = /M203 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;//Maximum feedrates (units/s)            
            self.eepromM206RegEx = /M206 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;//Home offset
            self.eepromM304RegEx = /M304 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)/;//bed PID settings
            self.eepromM420RegEx = /M420 ([S])([0-1]*)[^0-9]*([Z]*)(.*)/;//Auto Bed Leveling
            self.eepromM851RegEx = /M851 ([Z])(.*)/;//Z-Probe Offset (mm)
            self.eepromM665RegEx = /M665 ([L])(.*)[^0-9]([R])(.*)[^0-9]([H])(.*)[^0-9]([S])(.*)[^0-9]([B])(.*)[^0-9]([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;//delta config
            self.eepromM666RegEx = /M666 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;//delta Enstop adjustement

            // Specific versions
            if(version == "Marlin bugfix-2.0.x") {
                self.eepromM900RegEx = /M900 ([K])([0-9.]+)(.*)/;//bugfix2.0.x
                //Advanced: B<min_segment_time_us> S<min_feedrate> T<min_travel_feedrate> X<max_x_jerk> Y<max_y_jerk> Z<max_z_jerk> E<max_e_jerk>
                self.eepromM205RegEx = /M205 ([B])(.*)[^0-9]([S])(.*)[^0-9]([T])(.*)[^0-9]([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
                self.eepromM145S0RegEx = /M145 S0 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;//Material heatup parameters
                self.eepromM145S1RegEx = /M145 S1 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;//Material heatup parameters
                self.eepromM145S2RegEx = /M145 S2 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;//Material heatup parameters
                self.eepromM301RegEx = /M301 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)/;//hotend PID settings
                self.eepromM204RegEx = /M204 ([P])(.*)[^0-9]([R])(.*)[^0-9]([T])(.*)/;//Acceleration (units/s2): P<print_accel> R<retract_accel> T<travel_accel>
            } else if (version == 'latest' || version == 'Marlin 1.1.0-RC8' || version == 'Marlin 1.1.1' || version == 'Marlin 1.1.2' || version == 'Marlin 1.1.3' || version == 'Marlin 1.1.4' || version == 'Marlin 1.1.5' || version == 'Marlin 1.1.6' || version == 'Marlin 1.1.7' || version == 'Marlin 1.1.8') {
                self.eepromM205RegEx = /M205 ([S])(.*)[^0-9]([T])(.*)[^0-9]([B])(.*)[^0-9]([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
                self.eepromM145S0RegEx = /M145 S0 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM145S1RegEx = /M145 S1 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM145S2RegEx = /M145 S2 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM301RegEx = /M301 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)/;
                self.eepromM204RegEx = /M204 ([P])(.*)[^0-9]([R])(.*)[^0-9]([T])(.*)/;
                self.eepromM900RegEx = /M900 ([K])(.*)[^0-9]([R])(.*)/;//Linear Advance
            } else if (version == 'Marlin 1.1.0-RC1' || version == 'Marlin 1.1.0-RC2' || version == 'Marlin 1.1.0-RC3' || version == 'Marlin 1.1.0-RC4' || version == 'Marlin 1.1.0-RC5' || version == 'Marlin 1.1.0-RC6' || version == 'Marlin 1.1.0-RC7') {
                self.eepromM205RegEx = /M205 ([S])(.*)[^0-9]([T])(.*)[^0-9]([B])(.*)[^0-9]([X])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
                self.eepromM145S0RegEx = /M145 M0 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM145S1RegEx = /M145 M1 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM145S2RegEx = /M145 M2 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM301RegEx = /M301 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)[^0-9]([C])(.*)[^0-9]([L])(.*)/;
                self.eepromM204RegEx = /M204 ([P])(.*)[^0-9]([R])(.*)[^0-9]([T])(.*)/;
                self.eepromM900RegEx = /M900 ([K])(.*)[^0-9]([R])(.*)/;//Linear Advance
            } else if (version == 'Marlin 1.0.2+' || version == 'Marlin V1.0.2;' || version == 'Marlin 1.0.2' || version == 'Marlin V1;') {
                self.eepromM204RegEx = /M204 ([S])(.*)[^0-9]([T])(.*)/;
                self.eepromM205RegEx = /M205 ([S])(.*)[^0-9]([T])(.*)[^0-9]([B])(.*)[^0-9]([X])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
                self.eepromM301RegEx = /M301 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)/;
                self.eepromM900RegEx = /M900 ([K])(.*)[^0-9]([R])(.*)/;//Linear Advance
            } else {
                self.eepromM205RegEx = /M205 ([S])(.*)[^0-9]([T])(.*)[^0-9]([B])(.*)[^0-9]([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
                self.eepromM145S0RegEx = /M145 S0 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM145S1RegEx = /M145 S1 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM145S2RegEx = /M145 S2 ([H])(.*)[^0-9]([B])(.*)[^0-9]([F])(.*)/;
                self.eepromM301RegEx = /M301 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)/;
                self.eepromM204RegEx = /M204 ([P])(.*)[^0-9]([R])(.*)[^0-9]([T])(.*)/;
                self.eepromM900RegEx = /M900 ([K])(.*)[^0-9]([R])(.*)/;//Linear Advance
            }
        };

        self.control = parameters[0];
        self.connection = parameters[1];
        self.FIRMWARE_NAME = ko.observable("");
        self.FIRMWARE_INFO = ko.observable("");

        self.firmwareRegEx = /FIRMWARE_NAME:([^\s]*) ([^\s]*)/i;
        self.firmwareCapRegEx = /Cap:([^\s]*)/i;
        self.marlinRegEx = /Marlin[^\s]*/i;

        //self.setRegExVars('latest');
        self.setRegExVars('Marlin bugfix-2.0.x');

        self.isMarlinFirmware = ko.observable(false);
        self.isMarlinFirmware.subscribe(function (newValue) {
            self.loadEeprom();
        });

        self.isConnected = ko.computed(function() {
            return self.connection.isOperational() || self.connection.isPrinting() ||
            self.connection.isReady() || self.connection.isPaused();
        });

        self.isPrinting = ko.computed(function() {
           return self.connection.isPrinting() || self.connection.isPaused();
        });

        self.eepromData1 = ko.observableArray([]);
        self.eepromData2 = ko.observableArray([]);
        self.eepromDataLevel = ko.observableArray([]);
        self.eepromDataSteps = ko.observableArray([]);
        self.eepromDataFRates = ko.observableArray([]);
        self.eepromDataMaxAccel = ko.observableArray([]);
        self.eepromDataAccel = ko.observableArray([]);
        self.eepromDataPID = ko.observableArray([]);
        self.eepromDataPIDB = ko.observableArray([]);
        self.eepromDataHoming = ko.observableArray([]);
        self.eepromDataMaterialHS0 = ko.observableArray([]);
        self.eepromDataMaterialHS1 = ko.observableArray([]);
        self.eepromDataMaterialHS2 = ko.observableArray([]);
        self.eepromDataFilament = ko.observableArray([]);
        self.eepromDataEndstop = ko.observableArray([]);
        self.eepromDataDelta1 = ko.observableArray([]);
        self.eepromDataDelta2 = ko.observableArray([]);
        self.eepromDataLinear = ko.observableArray([]);

        self.onStartup = function() {
            $('#settings_plugin_eeprom_marlin_link a').on('show', function(e) {
                if (self.isConnected() && !self.isMarlinFirmware()) {
                    self._requestFirmwareInfo();
                }
            });
        };

        self.firmware_name = function() {
            return self.FIRMWARE_NAME();
        };

        self.firmware_info = function() {
            return self.FIRMWARE_INFO();
        };

        self.eepromFieldParse = function(line, restoreBackup = false) {
            var matchOK = self.eepromOKRegEx.exec(line);
            if (matchOK) {
                setTimeout(function() {self.setControls(true); }, 2000);
            }

            // M92 steps per unit
            var match = self.eepromM92RegEx.exec(line);
            if (match) {
                self.eepromDataSteps.push({
                    dataType: 'M92 X',
                    label: 'X axis',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: 'steps per unit'
                });

                self.eepromDataSteps.push({
                    dataType: 'M92 Y',
                    label: 'Y axis',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm',
                    description: 'steps per unit'
                });

                self.eepromDataSteps.push({
                    dataType: 'M92 Z',
                    label: 'Z axis',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 'mm',
                    description: 'steps per unit'
                });

                self.eepromDataSteps.push({
                    dataType: 'M92 E',
                    label: 'Extruder',
                    origValue: ((restoreBackup) ? '' : match[8]),
                    value: match[8],
                    unit: 'mm',
                    description: 'steps per unit'
                });
            }

            // M203 feedrates
            match = self.eepromM203RegEx.exec(line);
            if (match) {
                self.eepromDataFRates.push({
                    dataType: 'M203 X',
                    label: 'X axis',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: 'rate per unit'
                });

                self.eepromDataFRates.push({
                    dataType: 'M203 Y',
                    label: 'Y axis',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm',
                    description: 'rate per unit'
                });

                self.eepromDataFRates.push({
                    dataType: 'M203 Z',
                    label: 'Z axis',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 'mm',
                    description: 'rate per unit'
                });

                self.eepromDataFRates.push({
                    dataType: 'M203 E',
                    label: 'Extruder',
                    origValue: ((restoreBackup) ? '' : match[8]),
                    value: match[8],
                    unit: 'mm',
                    description: 'rate per unit'
                });
            }

            // M201 Maximum Acceleration (mm/s2)
            match = self.eepromM201RegEx.exec(line);
            if (match) {
                self.eepromDataMaxAccel.push({
                    dataType: 'M201 X',
                    label: 'X axis',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm/s2',
                    description: ''
                });

                self.eepromDataMaxAccel.push({
                    dataType: 'M201 Y',
                    label: 'Y axis',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm/s2',
                    description: ''
                });

                self.eepromDataMaxAccel.push({
                    dataType: 'M201 Z',
                    label: 'Z axis',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 'mm/s2',
                    description: ''
                });

                self.eepromDataMaxAccel.push({
                    dataType: 'M201 E',
                    label: 'Extruder',
                    origValue: ((restoreBackup) ? '' : match[8]),
                    value: match[8],
                    unit: 'mm/s2',
                    description: ''
                });
            }

            // M851 Z-Probe Offset
            match = self.eepromM851RegEx.exec(line);
            if (match) {
                self.eepromData1.push({
                    dataType: 'M851 Z',
                    label: 'Z-Probe Offset',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: ''
                });
            }

            // M206 Home offset
            match = self.eepromM206RegEx.exec(line);
            if (match) {
                self.eepromDataHoming.push({
                    dataType: 'M206 X',
                    label: 'X axis',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataHoming.push({
                    dataType: 'M206 Y',
                    label: 'Y axis',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataHoming.push({
                    dataType: 'M206 Z',
                    label: 'Z axis',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 'mm',
                    description: ''
                });
            }

            // M666 Endstop adjustment
            match = self.eepromM666RegEx.exec(line);
            if (match) {
                self.eepromDataEndstop.push({
                    dataType: 'M666 X',
                    label: 'X axis',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataEndstop.push({
                    dataType: 'M666 Y',
                    label: 'Y axis',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataEndstop.push({
                    dataType: 'M666 Z',
                    label: 'Z axis',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 'mm',
                    description: ''
                });
            }

            // M665 Delta settings
            match = self.eepromM665RegEx.exec(line);
            if (match) {
                self.eepromDataDelta1.push({
                    dataType: 'M665 L',
                    label: 'Diag Rod',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataDelta1.push({
                    dataType: 'M665 R',
                    label: 'Radius',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataDelta1.push({
                    dataType: 'M665 S',
                    label: 'Segments',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 's',
                    description: ''
                });

                self.eepromDataDelta2.push({
                    dataType: 'M665 A',
                    label: 'Diag A',
                    origValue: ((restoreBackup) ? '' : match[8]),
                    value: match[8],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataDelta2.push({
                    dataType: 'M665 B',
                    label: 'Diag B',
                    origValue: ((restoreBackup) ? '' : match[10]),
                    value: match[10],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataDelta2.push({
                    dataType: 'M665 C',
                    label: 'Diag C',
                    origValue: ((restoreBackup) ? '' : match[12]),
                    value: match[12],
                    unit: 'mm',
                    description: ''
                });
            }

            // M900 Linear settings
            match = self.eepromM900RegEx.exec(line);
            if (match) {
                self.eepromDataLinear.push({
                    dataType: 'M900 K',
                    label: 'Linear Advance K',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'mm',
                    description: ''
                });

                self.eepromDataLinear.push({
                    dataType: 'M900 R',
                    label: 'Linear Ratio',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'mm',
                    description: ''
                });
            }

            // Filament diameter
            match = self.eepromM200RegEx.exec(line);
            if (match) {
                if (self.eepromDataFilament().length === 0) {
                    self.eepromDataFilament.push({
                        dataType: 'M200 D',
                        label: 'Diameter',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm',
                        description: ''
                    });
                }
            }

            // M304 PID settings
            match = self.eepromM304RegEx.exec(line);
            if (match) {
                self.eepromDataPIDB.push({
                    dataType: 'M304 P',
                    label: 'Bed Kp',
                    origValue: ((restoreBackup) ? '' : match[2]),
                    value: match[2],
                    unit: 'term',
                    description: ''
                });

                self.eepromDataPIDB.push({
                    dataType: 'M304 I',
                    label: 'Ki',
                    origValue: ((restoreBackup) ? '' : match[4]),
                    value: match[4],
                    unit: 'term',
                    description: ''
                });

                self.eepromDataPIDB.push({
                    dataType: 'M304 D',
                    label: 'Kd',
                    origValue: ((restoreBackup) ? '' : match[6]),
                    value: match[6],
                    unit: 'term',
                    description: ''
                });
            }
            
            if (self.firmware_name() == 'Marlin 1.1.0-RC8' || self.firmware_name() == 'Marlin 1.1.1' || self.firmware_name() == 'Marlin 1.1.2' || self.firmware_name() == 'Marlin 1.1.3' || self.firmware_name() == 'Marlin 1.1.4' || self.firmware_name() == 'Marlin 1.1.5' || self.firmware_name() == 'Marlin 1.1.6' || self.firmware_name() == 'Marlin 1.1.7' || self.firmware_name() == 'Marlin 1.1.8' || self.firmware_name() == 'Marlin bugfix-2.0.x' || self.firmware_name() == 'Marlin bugfix-2.0.x (Github)') {
                console.log(self.firmware_name());
                // M205 Advanced variables
                match = self.eepromM205RegEx.exec(line);
                if (match) {
                    self.eepromData1.push({
                        dataType: 'M205 S',
                        label: 'Min feedrate',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 T',
                        label: 'Min travel',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 B',
                        label: 'Min segment',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 X',
                        label: 'Max X jerk',
                        origValue: ((restoreBackup) ? '' : match[8]),
                        value: match[8],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Y',
                        label: 'Max Y jerk',
                        origValue: ((restoreBackup) ? '' : match[10]),
                        value: match[10],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Z',
                        label: 'Max Z jerk',
                        origValue: ((restoreBackup) ? '' : match[12]),
                        value: match[12],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 E',
                        label: 'Max E jerk',
                        origValue: ((restoreBackup) ? '' : match[14]),
                        value: match[14],
                        unit: 'mm/s',
                        description: ''
                    });
                }

                // M204 Acceleration
                match = self.eepromM204RegEx.exec(line);
                if (match) {
                    self.eepromDataAccel.push({
                        dataType: 'M204 P',
                        label: 'Printing moves',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 R',
                        label: 'Retract',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 T',
                        label: 'Travel',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s2',
                        description: ''
                    });
                }

                // M301 PID settings
                match = self.eepromM301RegEx.exec(line);
                if (match) {
                    self.eepromDataPID.push({
                        dataType: 'M301 P',
                        label: 'Hotend Kp',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 I',
                        label: 'Ki',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 D',
                        label: 'Kd',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'term',
                        description: ''
                    });
                }

                // M145 Material heatup
                match = self.eepromM145S0RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 S0 H',
                        label: 'S0 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 S0 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 S0 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                match = self.eepromM145S1RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 S1 H',
                        label: 'S1 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 S1 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 S1 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                match = self.eepromM145S2RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 S2 H',
                        label: 'S2 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 S2 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 S2 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                // M420 Auto-level
                match = self.eepromM420RegEx.exec(line);
                if (match) {
                    self.eepromDataLevel.push({
                        dataType: 'M420 S',
                        label: 'Auto Bed Leveling',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '0/1',
                        description: ''
                    });

                    if (match.length >= 3) {
                        self.eepromDataLevel.push({
                            dataType: 'M420 Z',
                            label: 'Fade height',
                            origValue: ((restoreBackup) ? '' : match[4]),
                            value: match[4],
                            unit: 'mm',
                            description: ''
                        });
                    }
                }
            } else if (self.firmware_name() == 'Marlin 1.1.0-RC1' || self.firmware_name() == 'Marlin 1.1.0-RC2' || self.firmware_name() == 'Marlin 1.1.0-RC3' || self.firmware_name() == 'Marlin 1.1.0-RC4' || self.firmware_name() == 'Marlin 1.1.0-RC5' || self.firmware_name() == 'Marlin 1.1.0-RC6' || self.firmware_name() == 'Marlin 1.1.0-RC7') {
                // M205 Advanced variables
                match = self.eepromM205RegEx.exec(line);
                if (match) {
                    self.eepromData1.push({
                        dataType: 'M205 S',
                        label: 'Min feedrate',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 T',
                        label: 'Min travel',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 B',
                        label: 'Min segment',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 X',
                        label: 'Max X jerk',
                        origValue: ((restoreBackup) ? '' : match[8]),
                        value: match[8],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Y',
                        label: 'Max Y jerk',
                        origValue: ((restoreBackup) ? '' : match[10]),
                        value: match[10],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Z',
                        label: 'Max Z jerk',
                        origValue: ((restoreBackup) ? '' : match[12]),
                        value: match[12],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 E',
                        label: 'Max E jerk',
                        origValue: ((restoreBackup) ? '' : match[14]),
                        value: match[14],
                        unit: 'mm/s',
                        description: ''
                    });
                }

                // M204 Acceleration
                match = self.eepromM204RegEx.exec(line);
                if (match) {
                    self.eepromDataAccel.push({
                        dataType: 'M204 P',
                        label: 'Printing moves',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 R',
                        label: 'Retract',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 T',
                        label: 'Travel',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s2',
                        description: ''
                    });
                }

                // M301 PID settings
                match = self.eepromM301RegEx.exec(line);
                if (match) {
                    self.eepromDataPID.push({
                        dataType: 'M301 P',
                        label: 'Hotend Kp',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 I',
                        label: 'Ki',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 D',
                        label: 'Kd',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 C',
                        label: 'Kc',
                        origValue: ((restoreBackup) ? '' : match[8]),
                        value: match[8],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 L',
                        label: 'LPQ',
                        origValue: ((restoreBackup) ? '' : match[10]),
                        value: match[10],
                        unit: 'len',
                        description: ''
                    });
                }

                // M145 Material heatup
                match = self.eepromM145S0RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 M0 H',
                        label: 'M0 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 M0 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 M0 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                match = self.eepromM145S1RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 M1 H',
                        label: 'M1 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 M1 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 M1 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                match = self.eepromM145S2RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 M2 H',
                        label: 'M2 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 M2 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 M2 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }
            } else if (self.firmware_name() == 'Marlin 1.0.2+' || self.firmware_name() == 'Marlin V1.0.2;' || self.firmware_name() == 'Marlin 1.0.2' || self.firmware_name() == 'Marlin V1;') {
                // M205 Advanced variables
                match = self.eepromM205RegEx.exec(line);
                if (match) {
                    self.eepromData1.push({
                        dataType: 'M205 S',
                        label: 'Min feedrate',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 T',
                        label: 'Min travel',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 B',
                        label: 'Min segment',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 X',
                        label: 'Max X jerk',
                        origValue: ((restoreBackup) ? '' : match[8]),
                        value: match[8],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Z',
                        label: 'Max Z jerk',
                        origValue: ((restoreBackup) ? '' : match[10]),
                        value: match[10],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 E',
                        label: 'Max E jerk',
                        origValue: ((restoreBackup) ? '' : match[12]),
                        value: match[12],
                        unit: 'mm/s',
                        description: ''
                    });
                }

                // M204 Acceleration
                match = self.eepromM204RegEx.exec(line);
                if (match) {
                    self.eepromDataAccel.push({
                        dataType: 'M204 S',
                        label: 'Printing moves',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 T',
                        label: 'Travel',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s2',
                        description: ''
                    });
                }

                // M301 PID settings
                match = self.eepromM301RegEx.exec(line);
                if (match) {
                    self.eepromDataPID.push({
                        dataType: 'M301 P',
                        label: 'Hotend Kp',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 I',
                        label: 'Ki',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 D',
                        label: 'Kd',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'term',
                        description: ''
                    });
                }
            } else {
                // M205 Advanced variables
                match = self.eepromM205RegEx.exec(line);
                if (match) {
                    self.eepromData1.push({
                        dataType: 'M205 S',
                        label: 'Min feedrate',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 T',
                        label: 'Min travel',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData1.push({
                        dataType: 'M205 B',
                        label: 'Min segment',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 X',
                        label: 'Max X jerk',
                        origValue: ((restoreBackup) ? '' : match[8]),
                        value: match[8],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Y',
                        label: 'Max Y jerk',
                        origValue: ((restoreBackup) ? '' : match[10]),
                        value: match[10],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 Z',
                        label: 'Max Z jerk',
                        origValue: ((restoreBackup) ? '' : match[12]),
                        value: match[12],
                        unit: 'mm/s',
                        description: ''
                    });

                    self.eepromData2.push({
                        dataType: 'M205 E',
                        label: 'Max E jerk',
                        origValue: ((restoreBackup) ? '' : match[14]),
                        value: match[14],
                        unit: 'mm/s',
                        description: ''
                    });
                }

                // M204 Acceleration
                match = self.eepromM204RegEx.exec(line);
                if (match) {
                    self.eepromDataAccel.push({
                        dataType: 'M204 P',
                        label: 'Printing moves',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 R',
                        label: 'Retract',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'mm/s2',
                        description: ''
                    });

                    self.eepromDataAccel.push({
                        dataType: 'M204 T',
                        label: 'Travel',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'mm/s2',
                        description: ''
                    });
                }

                // M301 PID settings
                match = self.eepromM301RegEx.exec(line);
                if (match) {
                    self.eepromDataPID.push({
                        dataType: 'M301 P',
                        label: 'Hotend Kp',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 I',
                        label: 'Ki',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: 'term',
                        description: ''
                    });

                    self.eepromDataPID.push({
                        dataType: 'M301 D',
                        label: 'Kd',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: 'term',
                        description: ''
                    });
                }

                // M145 Material heatup
                match = self.eepromM145S0RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 S0 H',
                        label: 'S0 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 S0 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS0.push({
                        dataType: 'M145 S0 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                match = self.eepromM145S1RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 S1 H',
                        label: 'S1 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 S1 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS1.push({
                        dataType: 'M145 S1 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                match = self.eepromM145S2RegEx.exec(line);
                if (match) {
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 S2 H',
                        label: 'S2 Hotend Temperature',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 S2 B',
                        label: 'Bed Temperature',
                        origValue: ((restoreBackup) ? '' : match[4]),
                        value: match[4],
                        unit: '',
                        description: ''
                    });
                    self.eepromDataMaterialHS2.push({
                        dataType: 'M145 S2 F',
                        label: 'Fan Speed',
                        origValue: ((restoreBackup) ? '' : match[6]),
                        value: match[6],
                        unit: '',
                        description: ''
                    });
                }

                // M420 Auto-level
                match = self.eepromM420RegEx.exec(line);
                if (match) {
                    self.eepromDataLevel.push({
                        dataType: 'M420 S',
                        label: 'Auto Bed Leveling',
                        origValue: ((restoreBackup) ? '' : match[2]),
                        value: match[2],
                        unit: '0/1',
                        description: ''
                    });

                    if (match.length >= 3) {
                        self.eepromDataLevel.push({
                            dataType: 'M420 Z',
                            label: 'Fade height',
                            origValue: ((restoreBackup) ? '' : match[4]),
                            value: match[4],
                            unit: 'mm',
                            description: ''
                        });
                    }
                }
            }
        };

        self.fromHistoryData = function(data) {
            _.each(data.logs, function(line) {
                var match = self.firmwareRegEx.exec(line);
                if (match !== null) {
                    self.FIRMWARE_NAME(match[1] + ' ' + match[2]);
                    self.FIRMWARE_INFO(line.replace('Recv: ', ''));
                    self.setRegExVars(self.firmware_name());
                    console.debug('Firmware: ' + self.firmware_name());
                    if (self.marlinRegEx.exec(match[0]))
                    self.isMarlinFirmware(true);
                }

                var match = self.firmwareCapRegEx.exec(line);
                if (match !== null) {
                    self.FIRMWARE_INFO('\n\n' + self.firmware_info() + '\n' + line.replace('Recv: Cap:', ''));
                }
            });
        };

        self.fromCurrentData = function(data) {
            hasChangedEepromForm = true;
            if (!self.isMarlinFirmware()) {
                _.each(data.logs, function (line) {
                    var match = self.firmwareRegEx.exec(line);
                    if (match) {
                        self.FIRMWARE_NAME(match[1] + ' ' + match[2]);
                        self.FIRMWARE_INFO(line.replace('Recv: ', ''));
                        console.debug("EEPROM_plugins set regexvars");
                        self.setRegExVars(self.firmware_name());
                        console.debug('Firmware: ' + self.firmware_name());
                        if (self.marlinRegEx.exec(match[0]))
                        self.isMarlinFirmware(true);
                    }

                    var match = self.firmwareCapRegEx.exec(line);
                    if (match) {
                        self.FIRMWARE_INFO(self.firmware_info() + '\n' + line.replace('Recv: Cap:', ''));
                        console.debug(line.replace('Recv: ', ''));
                    }
                });
            }
            else
            {
                match = self.eepromM501RegEx.exec(data.logs);
                if (match) {
                    self.startBackup = true;
                }
                if (self.execBackup && self.startBackup) {
                    self.backupConfig += data.logs + "\n";

                    match = self.eepromM851RegEx.exec(self.backupConfig);
                    matchOK = self.eepromOKRegEx.exec(self.backupConfig);
                    if (match || matchOK) {
                        self.execBackup = false;
                        self.backupConfig = self.backupConfig.replace(/Recv/gi, "\nRecv");
                        self.backupConfig = self.backupConfig.replace(/,\n/gi, "\n");

                        console.debug("EEPROM Config: " + self.backupConfig);
                        var currentBackupDate = new Date();
                        var backupYear = currentBackupDate.getFullYear();
                        var backupMonth = currentBackupDate.getMonth() + 1;
                        if (backupMonth < 10)
                        backupMonth = '0' + backupMonth;
                        var backupDay = currentBackupDate.getDate();
                        if (backupDay < 10)
                        backupDay = '0' + backupDay;
                        var backupHours = currentBackupDate.getHours();
                        if (backupHours < 10)
                        backupHours = '0' + backupHours;
                        var backupMinutes = currentBackupDate.getMinutes();
                        if (backupMinutes < 10)
                        backupMinutes = '0' + backupMinutes;
                        var backupSeconds = currentBackupDate.getSeconds();
                        if (backupSeconds < 10)
                        backupSeconds = '0' + backupSeconds;
                        var backupDate = backupYear + '-' + backupMonth + '-' + backupDay + '_' + backupHours + backupMinutes + backupSeconds;

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(self.backupConfig));
                        element.setAttribute('download', 'eeprom_marlin_' + backupDate + '.cfg');
                        element.style.display = 'none';
                        document.body.appendChild(element);

                        element.click();

                        document.body.removeChild(element);
                        setTimeout(function() {self.setControls(true); }, 2000);
                    }
                }

                _.each(data.logs, function (line) {
                    self.eepromFieldParse(line);
                });
            }
            hasChangedEepromForm = false;
        };

        self.eepromDataCount = ko.computed(function() {
            return (self.eepromData1().length + self.eepromData2().length) > 0;
        });

        self.eepromDataStepsCount = ko.computed(function() {
            return self.eepromDataSteps().length > 0;
        });

        self.eepromDataFRatesCount = ko.computed(function() {
            return self.eepromDataFRates().length > 0;
        });

        self.eepromDataMaxAccelCount = ko.computed(function() {
            return self.eepromDataMaxAccel().length > 0;
        });

        self.eepromDataAccelCount = ko.computed(function() {
            return self.eepromDataAccel().length > 0;
        });

        self.eepromDataPIDCount = ko.computed(function() {
            return (self.eepromDataPID().length + self.eepromDataPIDB().length) > 0;
        });

        self.eepromDataHomingCount = ko.computed(function() {
            return self.eepromDataHoming().length > 0;
        });

        self.eepromDataMaterialCount = ko.computed(function() {
            return (self.eepromDataMaterialHS0().length + self.eepromDataMaterialHS1().length + self.eepromDataMaterialHS2().length) > 0;
        });

        self.eepromDataFilamentCount = ko.computed(function() {
            return self.eepromDataFilament().length > 0;
        });

        self.eepromDataEndstopCount = ko.computed(function() {
            return self.eepromDataEndstop().length > 0;
        });
        self.eepromDataDeltaCount = ko.computed(function() {
            return (self.eepromDataDelta1().length + self.eepromDataDelta2().length) > 0;
        });

        self.onEventConnected = function() {
            self._requestFirmwareInfo();
            // removed for prevent dual Load
            //setTimeout(function() {self.loadEeprom(); }, 5000);
        };

        self.onStartupComplete = function() {
            // removed for prevent dual Load
            //setTimeout(function() {self.loadEeprom(); }, 5000);
        };

        self.onEventDisconnected = function() {
            self.isMarlinFirmware(false);
        };

        self.backupEeprom = function() {
            // prevent dual load
            self.setControls(false);

            self.execBackup = true;
            self.backupConfig = "";

            self.eepromData1([]);
            self.eepromData2([]);
            self.eepromDataLevel([]);
            self.eepromDataSteps([]);
            self.eepromDataFRates([]);
            self.eepromDataMaxAccel([]);
            self.eepromDataAccel([]);
            self.eepromDataPID([]);
            self.eepromDataPIDB([]);
            self.eepromDataHoming([]);
            self.eepromDataMaterialHS0([]);
            self.eepromDataMaterialHS1([]);
            self.eepromDataMaterialHS2([]);
            self.eepromDataFilament([]);
            self.eepromDataEndstop([]);
            self.eepromDataDelta1([]);
            self.eepromDataDelta2([]);
            self.eepromDataLinear([]);

            self._requestEepromData();
        };

        self.restoreEeprom = function() {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            document.getElementById('fileBackup').addEventListener('change', self.handleFileSelect, false);
            document.getElementById('fileBackup').click();
        };

        self.resetEeprom = function() {
            showConfirmationDialog({
                message: 'Do you really want to reset EEPROM settings?',
                onproceed: function() {
                    // prevent dual load
                    self.setControls(false);

                    self.control.sendCustomCommand({ command: "M502" });
                    self.control.sendCustomCommand({ command: "M500" });
                    self.control.sendCustomCommand({ command: "M504" });

                    new PNotify({
                        title: 'EEPROM Marlin',
                        text: 'Default settings was restored.',
                        type: 'success',
                        hide: true
                    });

                    self.loadEeprom();
                },
            });
        };

        self.handleFileSelect = function(evt) {
            var files = evt.target.files;

            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();

                reader.onload = (function(cFile) {
                    return function(e) {
                        // prevent dual load
                        self.setControls(false);

                        self.backupConfig = e.target.result;

                        self.eepromData1([]);
                        self.eepromData2([]);
                        self.eepromDataLevel([]);
                        self.eepromDataSteps([]);
                        self.eepromDataFRates([]);
                        self.eepromDataMaxAccel([]);
                        self.eepromDataAccel([]);
                        self.eepromDataPID([]);
                        self.eepromDataPIDB([]);
                        self.eepromDataHoming([]);
                        self.eepromDataMaterialHS0([]);
                        self.eepromDataMaterialHS1([]);
                        self.eepromDataMaterialHS2([]);
                        self.eepromDataFilament([]);
                        self.eepromDataEndstop([]);
                        self.eepromDataDelta1([]);
                        self.eepromDataDelta2([]);
                        self.eepromDataLinear([]);

                        _.each(self.backupConfig.split('\n'), function (line) {
                            self.eepromFieldParse(line, true);
                        });
                    };
                })(f);

                reader.readAsText(f);
            }
            $('#eeprom_marlin_upload').addClass("btn-primary");
        };

        self.setControls = function(state) {
            if (self.stateControls != state) {
                self.stateControls = state;

                $('#eeprom_marlin_load').prop('disabled', !state);
                $('#eeprom_marlin_upload').prop('disabled', !state);
                $('#eeprom_marlin_backup').prop('disabled', !state);
                $('#eeprom_marlin_restore').prop('disabled', !state);
                $('#eeprom_marlin_reset').prop('disabled', !state);
            }
        };

        self.loadEeprom = function() {
            // prevent dual load
            self.setControls(false);

            self.eepromData1([]);
            self.eepromData2([]);
            self.eepromDataLevel([]);
            self.eepromDataSteps([]);
            self.eepromDataFRates([]);
            self.eepromDataMaxAccel([]);
            self.eepromDataAccel([]);
            self.eepromDataPID([]);
            self.eepromDataPIDB([]);
            self.eepromDataHoming([]);
            self.eepromDataMaterialHS0([]);
            self.eepromDataMaterialHS1([]);
            self.eepromDataMaterialHS2([]);
            self.eepromDataFilament([]);
            self.eepromDataEndstop([]);
            self.eepromDataDelta1([]);
            self.eepromDataDelta2([]);
            self.eepromDataLinear([]);

            self._requestEepromData();

            $('#eeprom_marlin_upload').removeClass("btn-primary");
            hasChangedEepromForm = false;
        };

        self.saveEeprom = function()  {
            // prevent dual load
            self.setControls(false);

            var cmd = 'M500';
            var eepromData = self.eepromData1();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromData2();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataLevel();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataSteps();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataFRates();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataMaxAccel();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataAccel();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataPID();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataPIDB();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataHoming();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataMaterialHS0();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataMaterialHS1();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataMaterialHS2();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataFilament();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataEndstop();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataDelta1();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataDelta2();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            eepromData = self.eepromDataLinear();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.value);
                    data.origValue = data.value;
                }
            });

            self.control.sendCustomCommand({ command: cmd });

            $('#eeprom_marlin_upload').removeClass("btn-primary");
            hasChangedEepromForm = false;

            self.control.sendCustomCommand({ command: "M504" });
            self.loadEeprom();

            new PNotify({
                title: 'EEPROM Marlin',
                text: 'EEPROM data stored.',
                type: 'success',
                hide: true
            });
        };

        self._requestFirmwareInfo = function() {
            if (!self.isPrinting()) {
                self.control.sendCustomCommand({ command: "M115" });
            }
        };

        self._requestEepromData = function() {
            if (!self.isPrinting()) {
                self.control.sendCustomCommand({ command: "M504" });
                self.control.sendCustomCommand({ command: "M501" });
            }
        };

        self._requestSaveDataToEeprom = function(data_type, value) {
            var cmd = data_type + value;
            self.control.sendCustomCommand({ command: cmd });
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        EepromMarlinViewModel,
        ["controlViewModel", "connectionViewModel"],
        "#settings_plugin_eeprom_marlin"
    ]);
});

changedEepromForm = function() {
    if (!hasChangedEepromForm) {
        $('#eeprom_marlin_upload').addClass("btn-primary");
        hasChangedEepromForm = true;
    }
};

---
title: "Lua for Scripting"
description: ''
pubDate: '2007-08-30'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "lua"
  - "programming"
---

**AT MY DAILY** work we use MIB's extensively for product configurations. This often brings up the need to recreate a certain configuration sequence. If the scequence is not included in the normal test suite, and the sequence is more that just a couple of OID's, I usually create a small Lua script to perform the MIB configuration.

Currently I am using Lua for scripting and the [Net-Snmp](http://net-snmp.sourceforge.net/ "Net-Snmp") command line tools as backend.

Here follows a **simplified** example of my normal Lua scripts. First step is to define the OID's to use. I collect these in a file called `Mibs.lua`

```lua
#!lua
--[[
      Net-Snmp datatypes:
         i: INTEGER, u: unsigned INTEGER, t: TIMETICKS, a: IPADDRESS
         o: OBJID, s: STRING, x: HEX STRING, d: DECIMAL STRING, b: BITS
         U: unsigned int64, I: signed int64, F: float, D: double
--]]

-- Standard MIB
Mib_sysName     = { "1.3.6.1.2.1.1.5", "s" }
Mib_sysLocation = { "1.3.6.1.2.1.1.6", "s" }

```

This file defines to tables containing each a OID prefix and the datatype.

Invoking the SNMP calls to perform the MIB manipulations is handled by a Lua class that wraps the Net-Snmp command line tools. This class is located in a file `Snmp.lua`

```lua
#!lua
--[[
      SNMP by using Net-SNMP executeables
--]]

-- Mibs.lua provides MIB definitions.
mibs_lua = loadfile("Mibs.lua") -- Include the file in compilation
mibs_lua()                      -- Define its contents

CSnmp = {}

function CSnmp:new(o)
  -- Create object
  o = o or {}

  -- Set 'self' as prototype for the table (object)
  setmetatable(o, self)
  self.__index = self

  -- Initialize
  self:Initialize()
  return (o)
end

-- Initialize
function CSnmp:Initialize()
  self.dut  = "10.0.0.17"          -- IP of DUT
  --self.attr = "-r 3 -t 500 "     -- Three retry's with timeout of 500[ms]
  self.attr = "-r 0 "              -- No retry
  self.opt  = "-c private -v 2c "
  self.set  = "snmpset.exe "       -- Net-Snmp commandline tool for 'SET'
  self.get  = "snmpget.exe "       -- Net-Snmp commandline tool for 'GET'
end

--[[ MIB set.
     Set an OID for an optional line with a value.
     IN:    oid:       OID to set. Format is { "oid prefix", "type" }.
            component: Component specifier.
            value:     Value to set.
--]]
function CSnmp:Set(oid, component, value)

  -- Comprise OID prefix and component specifier (if any)
  local oidFull = oid[1] .. component;

  -- Append identify value type
  local cmdType = " " .. oid[2] .. " "

  -- Wrap string types in "'s
  local cmdValue
  if cmdType == " x " or cmdType == " s " then
    cmdValue = "\"" .. value .. "\""
  else
    cmdValue = value
  end

  -- Collect command line
  local cmd = self.set .. self.attr .. self.opt .. self.dut .. " " ..
          '"' .. oidFull .. '"' .. cmdType .. tostring(cmdValue)

  -- Run the external program with parameters
  --print(cmd)  -- Debug
  os.execute(cmd)
end

--[[ MIB get.
     Get an OID value.
     IN:    oid:    OID to set (including line if required).
--]]
function CSnmp:Get(oid)
  local cmd = self.get .. self.opt .. self.dut .. " " .. oid
  os.execute(cmd)
end

```

The table CSnmp defines a function `new` that provides object allocation and configuration for the Net-Snmp command line tools. Two methods are defined in the class: a `Set` and a `Get`. The method `Set` accepts a table of the kind defined in the file `Mibs.lua`. The `component` parameter is for adding ".0" or perhaps a table index to the OID. The simpler `Get` member accepts a full specified OID only.

The files created so far can be reused by all configuration scripts. An example of a configuration script could be to request the (configured) location of the device, and the set a new location.

```lua
#!lua

-- Snmp.lua provides SNMP GET/SET functionality.
snmp_lua = loadfile("Snmp.lua") -- Include the file in compilation
snmp_lua()                      -- Define its contents

snmp = CSnmp:new()

print("GET Location:")
snmp:Get(Mib_sysLocation[1] .. ".0")

print("SET Location:")
snmp:Set(Mib_sysLocation, ".0", "Mars")

print("GET Location:")
snmp:Get(Mib_sysLocation[1] .. ".0")

```

Running the script produces the following output:

```text
>sys.lua
  GET Location:
  iso.3.6.1.2.1.1.6.0 = STRING: "Moon"
  SET Location:
  1.3.6.1.2.1.1.6.0: "Mars"
  GET Location:
  iso.3.6.1.2.1.1.6.0 = STRING: "Mars"

```

The scripts started out as Python scripts. I then ported them all to Ruby just to compare the two languages. Finally I ported the scripts to Lua. For basic scripting, there is actually not much difference between Python, Ruby or Lua, other than perhaps the storage needs. The Lua interpreter and library footprint is about 200KB which is only a fraction of the space occupied by the ActivePython or ActiveRuby allowed for installation on our company computers. The small size is handy if moving the scripts to run directly on the closed network test equipment.

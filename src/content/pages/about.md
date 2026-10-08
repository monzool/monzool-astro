---
title: 'About Me'
description: 'Who is monzool'
---

<style>
  .prose > h1 { color: #3A86FF; }
  .prose > h2 { color: #8338EC; }
  .prose > h3 { color: #ff46a4; }
  .prose > h4 { color: #FB5607; }
  .prose > h5 { color: #FFBE0B; }
</style>


**MY NAME IS** Jan Skriver Sørensen (aka Monzool) and I live in mainland Denmark on the east coast side of Jutland.

I am a software engineer by trade, and have spent most of my career as a staff software engineer.

## Why `monzool`?

The back part `zool` is a from my fascination of the 1984 [Ghostbusters](https://en.wikipedia.org/wiki/Ghostbusters) movie and the *demonic demigoddess* [Zuul](https://ghostbusters.fandom.com/wiki/Zuul). There is a scene where Sigourney Weaver is unpacking groceries in her kitchen, opens her refrigerator door and a demonic terror dog appears from an otherworldly portal and growls the name "Zuul". I always thought that was a cool scene. I then prefixed it with a shorted "mono" going for something like "The one Zuul" 😈. I finally swapped to `u` with `o` for consistency and up popped a worldly unique nickname `monzool`. It has now stuck with me for the better part of my lifespan 😄


⠀

# *Curriculum Vitae*


## Work Experience 👷

### Trifork A/S 💻

2023 – Now

#### Building a secure build an deploy pipeline

**Timeframe**: 2025-09 – 2026-09

**Technologies**: Github (GHEC), CaC, TypeScript, Github Actions, Azure, yaml, bash, PowerShell, Nexus, Windows, WSL, C\#, python, JavaScript, apt, npm, nuget, PlayWright, ActionLint

**Description**:
Developing a security hardened build pipeline in fin-tech setting. Agenda was to build a single, all encompassing, pipeline that handles build and deploy of all the corporations projects. This meant being able to build Node.js, C#, Python, Java apps, and more. Developers could not change workflows themselves🔒 Instead projects would configure builds and deployments using our own custom developed json scheme.

**Highlights**:
- Developing new workflows, actions and tooling
- Exploration of solutions and negotiating compromises that provided the best solution that satisfied both security requirements and developer needs.
- Guidance of projects in adopting this new build platform.
- Discussions, planning and implementations of solutions as projects requirement arose.
- Managing of github user seats and copilot licenses.
- All github configuration made as code (CaC) via a TypeScript app.
- Support/hotline
- Documentation

**Environment**:
- Development on Windows + WSL
- On site
- Part of team with one manager from the company and one remote company employee
- Github Enterprise Cloud
- Kanban

#### Production quality assurance using visual AI

**Timeframe**: 2024-11 – 2025-09

**Technologies**: C\#, MQTT, Python, Streamlit, Docker, Docker Compose, supervisord, haproxy, PLC, Linux, Azure, Windows, Windows Services, OpenAPI, ASP.Net

**Description**:
Controlling a visual AI system with conveyor belt, specialized cameras and lighting. Included trips to Spain. Monitoring and control in a Streamlit web-app using OpenAPI generated rest-api to an ASP.Net server. Utilizing [supervisord](https://supervisord.org/) in the web-app docker container. Reverse proxy done by [haproxy](https://www.haproxy.org/). TACO (Threshold/Time-Activated Counter Operation) architecture for per-site dynamically configured activation of lights and cameras. Data collection of results for AI processing. Strict logging and persistence requirements for all activities.

**Highlights**:
- Testing and debugging on real production machine in high secret/secure facilities
- Close collaboration with company responsible for PLC code. Many joint debugging/testing sessions on site facilities.
- Monitoring and participation in foreign country production site test and validation from remote

**Environment**:
- Development on Linux, production on Windows
- Off site
- Team of two data scientist and two C\# developers from Trifork. One project owner from the company
- Azure DevOps
- Scrum (managed by Trifork team)


#### DeepStream exploration

**Timeframe**: 2 months

**Technologies**: DeepStream, Jetson, C++, Python

**Description**:
Setup and configuration of NVidia Jetson and DeepStream framework for object detection using YOLO.


#### A modernizing edition of everyday equipment

**Timeframe**: 2 months

**Technologies**: C\++, C\#, Yocto, Excel, React

**Description**:
Joined a team that worked on a project to modernize an everyday equipment with interactive UI and smart monitoring. The BSP was made with Yocto running self developed C++ middelware for controlling and monitoring the equipment. My responsibilities was mainly the device (variant) management system which was a C\# application that extracted device data from the company's internal live Excel sheets (basically device configuration in Excel 😅).

**Environment**:
- Three developers (one React, one C++ and one C\#) from and one manager all from Trifork
- Bitbucket
- Off site.
- Scrum (managed by Trifork team)


#### Connection and firmware update framework

**Timeframe**: 2023-09 – 2024-07

**Technologies**: C\#, Unity, Swift, Android, iPhone, Mac OS

**Description**:
Development of a connection framework for embedded systems using proprietary protocols over bluetooth. The framework supported connection and firmware updating of both legacy and next generation systems with support for both Android and iPhone platforms. This was the base for all company apps, so high quality was a priority


**Environment**:
- Development on Mac OS, deployment to Android and iPhones
- Trifork team of four developers and the company a manager, team-lead and a developer
- Gitlab (self-hosted by company)
- Off site for most part. On-site once a week
- Scrum (shared facilitation)


#### Embedded development on limited hardware

**Timeframe**: 1 month

**Technologies**: C

**Description**:
Joined as extra hand on a large development team doing a state of the art embedded product on limited hardware. Did feature implementations, general review of the project and documentation in Confluence.

**Environment**:
- Windows + WSL
- Gitlab (self-hosted by company)
- Mostly on site
- Scrum (shared facilitation)


#### Building automation

**Technologies**: Yaml, Zig-Bee, Thread/Matter

**Description**:
Setting up a Home Assistant system for automated monitoring and controlling of lights on/off and windows opening/closing. Control via configured iPad using Home Assistant widgets

**Environment**:
- Development on Linux. Deployment to embedded system
- Github
- On site


### Bang & Olufsen a/s 🎵

2008 – 2023

#### 2022 – 2023

**Technologies**: Python 3.10, pytest, Autotest (CEC, EDID, SDDP, WiFi, Bluetooth), Lua

**Description**:
Automatic testing in proprietary Python framework building upon pytest. Testing/verification of product features, e.g. by use of REST API. Test management in Jira/X-Ray. Strict use of MyPy for types. This was a huge shared in-house test framework for testing all B&O next generation products.

**Highlights**:
- Developing new test cases for new features on any product. This involves getting domain knowledge of feature to test, discussions with developers of focus areas and identifying potential side effects
- Analyzing and debugging issues found. The collaborate with responsible developer by providing supporting traces and data.
- Day to day monitoring of new and solved issues
- Setup and maintenance of Raspberries for test execution on test-sites
- Did an activation automation using Arduino relay boards
- Control of CEC emitters/receivers for CEC validation
- Bluetooth self-certification
- Internal Dolby certification tests using Dolby's linux powered test framework
- Wrote a SDDP plugin for Wireshark in Lua with trace inspection from the automated test framework

#### 2021 – 2022

**Technologies**: JavaScript, React, Redux, Bootstrap, Babel, OpenAPI, Go, Docker, GitHub Actions

Update and upgrade of web UI for high-end speakers. Later a complete re-implementation of the web UI with new web technologies for the next version of the mentioned high-end speakers.

The story: [monzool.net/blog/2021/12/14/my-encounters-on-doing-web-development](https://monzool.net/blog/2021/12/14/my-encounters-on-doing-web-development)

#### 2020 – 2021

**Technologies**: C++98, C, Linux, Kernel debugging, Bash, Selenium, Docker, GitHub, MRuby, Logentries

**Description**:
New features and quality improvements for high-end speakers. Introduced Selenium for automated testing of the web UI. Developed an init rc script replacement and system monitoring tool in [mruby](https://mruby.org/). Hardened software quality with code analysis and strict compiler flags enforced. Out-of-band compilation with very latest compiler for improved diagnostics. Dockerized the build toolchain. [Logentries](https://www.rapid7.com/blog/tag/logentries/) for GDPR compliant diagnostics. One of the more curious things I had to make in my career, was taking advantage of glibc weak-linkage and overwrite `gettimeofday` (and other time functions) to redirect time requests to a frontend processor. Generally a lot of debugging in both user space and kernel space, Wireshark analysis

#### 2019 – 2019

**Technologies**: C++17, STM32, Mbed OS, CMake, OTA/USB DFU

**Description**:
Part of a small team for greenfield development of a battery-powered embedded WiFi project based on STM32, event driven Mbed OS, modern C++17, C, and a high-DPI touch display driven by the TouchGFX framework. USB abd OTA (Over-the-Air) DFU (Device Firmware Upgrade) handling.

#### 2017 – 2017

**Technologies**: C++14, Qt, Docker, Shippable, GitHub

**Description**:
Time-shared to become half of the flexible speakers team. Took over the project after its first release to market. Collaborated with an external partner responsible for the speaker driver software. Work consisted of feature development, bug-fixing of market issues, adding automated tests, and providing technical recommendations and investigations for future products and features.

#### 2016 – 2019

**Technologies**: C++98, C, Linux, Bash, AVB, Boost, Protobuf, Thrift, REST API, SOAP, JavaScript, React, RefluxJS, LogEntries, Subversion, ScratchBox

**Description**:
Joined the high-end speaker team. Development in C and C++ on an elderly Linux platform. Primary tasks: implementing a REST server in C++, control handling of sound functionality, adding features/bugfixes to the web UI, and software update handling. Retrofitted unit testing with boost::test (C++) and Ceedling/fff (C). Created the build system for collecting all software components into a deployable image. The original BSP was [ScratchBox](https://en.wikipedia.org/wiki/Scratchbox_2) based, which I ported to other build system

#### 2015 – 2016

**Technologies**: Android, Bluetooth

**Description**:
Assisted external partners with implementation and test of a Bluetooth remote control in an Android product. Included trips to Bengaluru, India.

#### 2011 – 2015

**Technologies**: C++98, REST API, XMPP

**Description**:
Development, integration, and test in C++ of advanced, market-differentiating features using a proprietary XMPP-based solution for inter-product control of streaming, and a highly documented REST-based interface for complete app/web control of all B&O products. Evaluated React as a web UI framework. Ported legacy security solutions to Linux platforms, and integrated OpenSSL security and HDCP libraries. Configured build systems and created Bash build scripts to facilitate building Linux embedded distros (WindRiver, Marvell, Yocto) in conjunction with software builds using B&O's proprietary build systems.

#### 2010 – 2011

**Technologies**: C++ (MSVC), Spotify

**Description**:
Integration of libspotify into a high-end sound system.

#### 2008 – 2010

**Technologies**: C++98, C, Linux, U-Boot

**Description**:
Ported an embedded Linux distribution to custom hardware, involving: U-Boot setup, device-tree configuration, driver adaptations, and driver debugging. Additional responsibilities included Upstart init scripts, build scripts, and providing a C++ API to abstract low-level details away for application developers. Worked with a Power Architecture SoC with PowerVR graphics and a RISC co-processor.

### Ericsson Diax 🌐 

2004 – 2008

#### 2004 – 2008

**Technologies**: C++, Tcl, MIB, SNMP, RPC

**Description**:
Development in C++, with test procedures also written in C++ and Tcl. Integrator of a new telephony framework provided by a new chip vendor. Implementer of transparent network support for a message-based RPC. Responsible for developing and maintaining management/control system APIs for accessing devices. Responsible for biweekly telephony software releases, including bug-hunting.


## Education 👨‍🎓

### 2000 – 2004

**B.Sc. EE** — Handels- og Ingeniørhøjskolen (HIH) i Herning

Courses included programming in C, C++, and Java with OOA&D and UML design techniques. Use of operating systems (Microsoft Windows, Linux, Minix) as well as education in the internal workings and principles of operating systems. Additionally: web technology, networking, and databases, as well as classic courses like physics and math.

**Bachelor Thesis:** Measuring network delay with RTP.

### 1994 – 1999

**Datamekaniker** — EUC-Syd, Sønderborg

PC repair, computer board development, programming in Assembly, C, C++, and Pascal.

Apprenticeship at Grundfos A/S. In the first years I Did a management utility in Visual Basic, an analytics program in Delphi and a Windows VxD driver for efficient transporting of "large" data quantities. Also learned Windows Server management, Windows and OS/2 installation and support (40+ diskettes juggling was not fun). Later was feature additions to existing products in Microsoft C++. Largest solo project was a control and monitoring system for an externally developed item counting system, used all over in the production lines. This involved also developing the protocol for communicating with the counting unit. Most fun project was making a label layout system for a Zebra printer. This was to automate label printing depending on which production line needed labels
# CNP3 map — which section of the textbook covers which lecture topic

The course publishes slides for lecture 1 and 2 only and names no textbook
[S1], [S36]. Lecture 1 named Kurose and Ross and Peterson and Davie as
background reading, neither free in full. CNP3 [S35] is the one free,
licence-clear, single-file book that covers most of the syllabus, so it is
vendored here as [`book/CNP3-2021.pdf`](book/CNP3-2021.pdf) (413 pages, release
2021, 3rd edition).

Read a row as: *this lecture topic is covered by this CNP3 section*. Topic
numbers are the running topic lines of the course page, which is what "after
lecture N" counts; sections and printed pages are CNP3's own, from its table of
contents. Where CNP3 is thin or silent the row says so and names what to read
instead: a vendored RFC in [`rfc/`](rfc/) (mapped section by section in
[`standards-map.md`](standards-map.md)) or Peterson and Davie 6th edition, whose
full text is free at <https://book.systemsapproach.org>.

## Part 1 of the lecture: foundations

| topic | lecture | CNP3 | page | fit |
|---|---|---|---|---|
| 1-2 | organization; networks and protocols | 2.1 Connecting two hosts, 2.7 The reference models | 5, 111 | good; CNP3 teaches five layers, the lecture used the same split |
| 3 | IETF, IANA, ICANN, RIR, NIC | 2.5 Naming and addressing | 72 | **thin**: CNP3 names the RIRs in passing and does not treat governance. Read the bodies' own pages and BCP 9 / BCP 78 instead; note 01 marks that section as non-RFC sourced |
| 4 | layer 1 refresher, bits, modulation | 2.1.1 The physical layer, 2.7.2 The Physical layer | 5, 111 | **thin**: a few pages, modulation barely mentioned. Peterson 6e ch2 "Direct Links" is the better read |
| 5 | forwarding paradigms (circuit, switched, state) | 2.2.1 The datagram organization, 2.2.2 Virtual circuit organization, 2.2.3 The control plane | 27 | **best in the book**: the datagram/virtual-circuit contrast is CNP3's opening argument |

## Part 2: layer 2 and layer 3

| topic | lecture | CNP3 | page | fit |
|---|---|---|---|---|
| 6 | Ethernet I (layer 2) | 2.1.2 The datalink layer, 2.6.4 Medium Access Control algorithms, 3.18.2 Ethernet | 5, 76, 253 | good |
| 7 | Ethernet II (hubs, switches, VLANs) | 3.18.2 Ethernet, lab 4.17 Spanning Tree and Virtual LANs | 253, 380 | good on switch learning and spanning tree, lighter on 802.1Q tagging than Peterson. The tag format is IEEE 802.1Q [S30] and is not vendorable |
| 8 | IPv4 intro (classes, CIDR, ARP) | 3.18.2 Ethernet (ARP) | 253 | **weakest row in the map**: the 3rd edition is IPv6-first and dropped the IPv4 addressing material, so classful addressing, subnet masks and CIDR arithmetic are effectively absent. Use RFC 791 and RFC 826 in `rfc/`, note 03, or Peterson 6e ch3 (CIDR itself is RFC 1519, not vendored) |
| 9 | IPv6, NDP | 3.14.1 IP version 6, 3.14.3 The IPv6 subnet, lab 4.14 IPv6 Networks | 209, 332 | **strongest row**: this is the book's centre of gravity, and the lab is a worked IPv6 network |
| 10 | static routing, longest prefix match | 3.14 The network layer, 3.15 Routing in IP networks | 209, 232 | good |
| 11 | link state | 2.2.3 The control plane, 3.16 Intradomain routing | 27, 233 | good: the control-plane section derives link state before any protocol is named |
| 12 | OSPF, IS-IS | 3.16.2 OSPF | 233 | OSPF good; **IS-IS only mentioned**. ISO 10589 is not free; RFC 1195 is the usable source, and is not vendored here |
| 13 | distance vector | 2.2.3 The control plane, 3.16.1 RIP | 27, 233 | good, including count-to-infinity |
| 14 | Babel, BGP | 3.17 Interdomain routing, 3.17.1 The Border Gateway Protocol, labs 4.15, 4.16 | 239, 346, 349 | BGP is the other place CNP3 beats both named textbooks, policy and valley-free paths included. **Babel is absent**: RFC 8966 only, not vendored here |
| 15 | ICMP, ICMPv6 | 3.14.2 ICMP version 6 | 209 | ICMPv6 good; ICMPv4 is RFC 792 in `rfc/` |

## Part 2: layer 4 and up

| topic | lecture | CNP3 | page | fit |
|---|---|---|---|---|
| 16 | UDP | 2.4 The transport layer, 3.11 The User Datagram Protocol | 54, 181 | good |
| 17 | TCP: handshake | 3.12 The Transmission Control Protocol, 3.12.1 TCP connection establishment, 3.12.6 TCP connection release | 183 | good |
| 18 | acknowledgements and loss recovery | 3.12.2 TCP reliable data transfer, 3.12.3 TCP windows, 3.12.4 TCP's retransmission timeout, 3.12.5 Advanced retransmission strategies | 183 | good, and 2.4.1 derives stop-and-wait and sliding windows first |
| 19 | congestion control | 3.13 Congestion control, 3.13.1 Controlling congestion without losing data, 3.13.2 Modeling TCP congestion control, 2.6.5 | 201, 76 | good; the model section is the sqrt(p) derivation also cited as [S29] |
| 20 | socket programming, Nagle | 4.3 Using sockets for inter-process communication | 275 | good: C sockets end to end, including endianness. Nagle is a remark in 3.12, the specification is RFC 896, not vendored here |
| 21 | DNS I | 3.2 The Domain Name System | 130 | good |
| 22 | DNS II (DNSSEC) | 3.9 Securing the Domain Name System | 177 | good, and the only free textbook treatment found: Peterson 6e does not cover DNSSEC at all |
| 23 | Telnet | 3.7 Remote login | 165 | good; CNP3 covers Telnet and then ssh |
| 24 | unicast, anycast, multicast | 2.5 Naming and addressing (anycast) | 72 | **thin**: no multicast routing, no PIM. Peterson 6e §4.3 Multicast covers PIM-SM and PIM-DM; RFCs 1112, 2236, 3376, 7761 and 4760 are in `rfc/` and note 09 is built on them |

## Exercises

191.030's five exercises are voluntary, released 19.10, 09.11, 23.11,
14.12.2026 and 11.01.2027, and the course publishes no practice material [S36].
CNP3's Part 3 is the closest free substitute and the lab sections matter more
than the question sets:

| CNP3 | page | what it is | use it for |
|---|---|---|---|
| 4.11 Analyzing packet traces | 312 | a worked `tcpdump` trace of `curl -6`, read field by field, DNS query through the TCP handshake, with the relative-sequence-number trap called out | exercise 1 and note 11's playbook |
| 4.12 TCP basics, 4.13 A closer look at TCP | 315 | trace-based TCP questions | exercises 3 and 4 |
| 4.14 IPv6 Networks | 332 | addressing and NDP on a worked topology | exercise 2 |
| 4.15 Inter-domain routing, 4.16 Exploring routing protocols | 346, 349 | BGP policy and routing-protocol behaviour | the mid-term's routing half |
| 4.17 Spanning Tree and Virtual LANs | 380 | switched-LAN exercises | topic 7 |
| 4.1-4.10 | 273 | multiple-choice, open and discussion questions per layer | general drill |

**No answer key.** CNP3's multiple-choice and auto-graded questions run on a
UCLouvain INGInious server and the open questions print no answers [S35], so
every worked solution in [`../src/exercises/uclouvain-cnp3-2019/`](../src/exercises/uclouvain-cnp3-2019/)
is ours, checked against the mechanism rather than against a key. That is
unchanged by vendoring the book.

## What this does not replace

The book is not the lecturer's. Fiebig stated that Kurose and Ross was an
inspiration whose "order, content and depth differ", with "significant
additional material" [S36], and CNP3 is not even that book. It is a substitute
for missing slides on *how the protocols work*, never evidence of *what will be
examined*: for that, read `../notes/00-exam-focus.md` and nothing else here.

Topics on the lecture list that no free textbook in this folder covers at all:
internet governance (topic 3), Babel (topic 14), RPKI and IRR as Wagner teaches
them, and multicast routing beyond the group-management RFCs.

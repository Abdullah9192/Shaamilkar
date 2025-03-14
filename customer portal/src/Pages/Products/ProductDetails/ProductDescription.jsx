import React from "react";

const ProductDescription = () => {
  const productSections = [
    {
      title: "Description",
      content:
        "Samsung Galaxy A05, with 64GB storage and 4GB RAM, operates on Android 13 OS and OneUI. Its 6.7-inch PLS LCD screen offers a resolution of 720 x 1600 pixels. The phone is powered by the MediaTek Helio G85 chipset and Mali-G52 GPU, ensuring smooth performance. It features a dual-camera setup with a 50MP main lens and a 2MP depth sensor, along with an 8MP front camera. With a robust 5000mAh battery, it supports 25W fast charging for extended use.",
    },
    {
      title: "Build",
      content: [
        "OS: Android 13 OS Light Green",
        "OneUI Dimensions: 168.8 x 78.2 x 8.8 mm",
        "Weight: 195 g",
        "SIM: Dual SIM",
        "Dual Standby (Nano-SIM)",
        "Colors: Black, Silver",
      ],
    },
    {
      title: "Frequency",
      content: [
        "2G Band SIM1/SIM2: GSM 850 / 900 / 1800 / 1900",
        "3G Band: HSDPA 850 / 900 / 2100",
        "4G LTE Band: (1)2100, (3)1800, (5)850, (7)2600, (8)900, (20)800, (38)2600, (40)2300, (41)2500",
      ],
    },
    {
      title: "Display",
      content: [
        "Technology: PLS LCD Capacitive Touchscreen, 16M Colors, Multitouch",
        "Size: 6.7 Inches",
        "Resolution: 720 x 1600 Pixels (~262 PPI)",
      ],
    },
    {
      title: "Processor",
      content: [
        "CPU: Octa-core (2 x 2.0 GHz Cortex-A75 + 6 x 1.8 GHz Cortex-A55)",
        "Chipset: Mediatek MT6769V/CZ Helio G85 (12nm)",
        "GPU: Mali-G52 MC2",
      ],
    },
    {
      title: "Camera",
      content: [
        "Main (Dual Camera): 50 MP, f/1.8 (wide), AF + 2 MP, f/2.4 (depth), LED Flash,",
        "Features: Geo-tagging, touch focus, face detection, panorama, HDR, Video (1080p@30/60fps)",
        "Resolution: 720 x 1600 Pixels (~262 PPI)",
        "Front: 8 MP, f/2.0",
      ],
    },
    {
      title: "Memory:",
      content: ["Built-in: 64GB Built-in, 4GB RAM", "Card: microSDXC"],
    },
    {
      title: "Connectivity",
      content: [
        "WLAN: Wi-Fi 802.11 a/b/g/n/ac, dual-band, Wi-Fi Direct",
        "Bluetooth: v5.3 with A2DP, LE",
        "GPS: Yes + A-GPS support & Glonass, BDS",
        "Radio: FM Radio",
        "USB: Type-C 2.0",
        "NFC: No",
        "Data: GPRS, EDGE, 3G (HSPA 42.2/5.76 Mbps), 4G (LTE Cat4 150/50 Mbps)",
      ],
    },
    {
      title: "Built-in Features",
      content: [
        "Sensors: Accelerometer, Proximity",
        "Audio Jack: 3.5mm",
        "Messaging: SMS (threaded view), MMS, Email, Push Mail, IM",
        "Games: Built-in + Downloadable",
        "Extra: Glass front, plastic back, plastic frame, Photo/video editor, Document viewer",
      ],
    },
    {
      title: "Battery",
      content: [
        "Capacity: Li-Po (non-removable), 5000 mAh – Fast charging 25W wired",
      ],
    },
  ];

  return (
    <div className="bg-white p-4 rounded">
      <div>
        <h4>Description</h4>
        <p className="mt-1">{productSections[0].content}</p>
      </div>
      <div className="p-3"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {productSections.slice(1).map((section, index) => (
          <div key={index} style={{ flex: "1 1 30%", minWidth: "200px" }}>
            <h5>{section.title}:</h5>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {section.content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDescription;

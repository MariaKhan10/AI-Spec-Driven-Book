---
id: robotics-applications-chapter8-capstone-autonomous-humanoid
title: "باب 8: کیپ اسٹون پروجیکٹ: خودکار ہومینائیڈ روبوٹ"
---

# باب 8: کیپ اسٹون پروجیکٹ: خودکار ہومینائیڈ روبوٹ

## 8.1 تعارف

یہ کیپ اسٹون پروجیکٹ آپ کے پہلے کے تمام ابواب میں سیکھی گئی معلومات کو ایک **مکمل عملی روبوٹ** میں تبدیل کرنے کا موقع دیتا ہے۔ اس کا مقصد ایک ایسا ہومینائیڈ روبوٹ تیار کرنا ہے جو:  

1. **آواز کے ذریعے ہدایات سمجھ سکے**  
2. **راستہ منصوبہ بندی** کر سکے اور رکاوٹوں سے بچتے ہوئے حرکت کرے  
3. **مخصوص اشیاء پہچان سکے**  
4. **اشیاء کو اٹھا کر صحیح جگہ پر رکھ سکے**  

### اہم ماڈیولز:
- **ROS 2** – روبوٹ کے تمام حصوں کے درمیان رابطہ  
- **Simulation (Gazebo / NVIDIA Isaac Sim)** – ماحول اور فزکس کی نقل  
- **NVIDIA Isaac AI** – جدید perception (جیسے object detection)  
- **VLA (Vision-Language-Action)** – آواز کو عملی اقدامات میں بدلنا  
- **Humanoid Control** – انسانی چلنے اور ہاتھ پاؤں کے کنٹرول  

### پروجیکٹ کے مراحل:
1. سیمولیشن اور روبوٹ تیار کرنا  
2. آواز کے کمانڈ کا ماڈیول  
3. Cognitive Planning یا دماغی منصوبہ بندی  
4. Navigation اور obstacle avoidance  
5. Object perception اور شناخت  
6. Manipulation اور grasping  
7. تمام ماڈیولز کو جوڑ کر ٹیسٹنگ  

---

## 8.2 سیمولیشن سیٹ اپ

### سیمولیٹر کا انتخاب:
- **Gazebo:** ہلکا، ROS 2 کے ساتھ آسان، بنیادی فزکس کے لیے بہتر  
- **Isaac Sim:** حقیقت کے قریب گرافکس، اعلیٰ AI perception، RTX GPU ضروری  

### روبوٹ ماڈل:
- موجود URDF/SDF ماڈلز استعمال کریں یا خود بنائیں  
- جسمانی خصوصیات اور sensors شامل کریں  

### ماحول:
- ایک سادہ کمرہ یا ٹیبل، کچھ static رکاوٹیں اور target objects رکھیں  

### ROS 2 bridge:
- Gazebo: `gazebo_ros_pkgs`  
- Isaac Sim: Isaac ROS bridge  
- Verify کریں کہ topics جیسے `/cmd_vel` یا joint states publish/subcribe ہو رہے ہیں  

---

## 8.3 آواز کے کمانڈ کا ماڈیول

### Speech Recognition:
- **OpenAI Whisper** یا Vosk استعمال کریں  
- ROS 2 Node (`speech_listener_node`) آڈیو capture کرے، text میں تبدیل کرے، `/speech_text` topic پر publish کرے  

### Natural Language Understanding (NLU):
- آواز کے text سے **intent اور entities** نکالیں  
- Options:  
  - **Rule-based:** keywords اور pattern سے  
  - **LLM-based:** چھوٹے LLM کے ساتھ  

**Structured Command کی مثال:**
```rosidl
# RobotCommand.msg
string intent
string[] entities  # جیسے ["direction:forward", "distance:2.0", "object:red_block"]
```

## 8.4 Cognitive Planning

### Planner:
- **LLM-based (advanced)** یا **Rule-based (Capstone کے لیے آسان)**  
- High-level commands کو **primitive actions** میں تبدیل کریں  

### Primitive Actions کی مثالیں:
- `move_base_to_pose(x, y, yaw)`  
- `look_at_point(x, y, z)`  
- `perform_grasp(object_id)`  
- `release_object()`  

### ROS 2 Action Server:
- تمام **primitive actions** کو execute کرے  
- Feedback دے  
- Errors handle کرے  



## 8.5 Navigation اور Obstacle Avoidance

### Mapping:
- SLAM (LIDAR + odometry) یا **pre-built map**  
- Isaac ROS VSLAM (advanced)  

### Localization:
- AMCL یا Isaac ROS localization  

### Path Planning:
- Nav2 global & local planner  
- **Bipedal walking** کے لیے adaptation  

### Dynamic Obstacle Avoidance:
- Sensor data کی بنیاد پر **real-time path adjustment**  

---

## 8.6 Object Identification & Perception

### Sensor Data:
- Simulated RGB-D camera (`/camera/image_raw`, `/camera/depth/image_raw`)  

### Vision Pipeline:
- **Object Detection:** YOLO/SSD/Faster-RCNN یا simple OpenCV color detection  
- **Pose Estimation:** Depth map یا PnP algorithm  
- **Publish info:** `/perceived_objects` topic  

---

## 8.7 Manipulation اور Grasping

### Steps:
1. **Pre-grasp اور grasp pose** calculate کریں  
2. **Inverse Kinematics** سے joint angles نکالیں  
3. Smooth trajectory generate کریں  
4. Grasp اور lift کریں  
5. Target location پر جا کر object release کریں  

---

## 8.8 Debugging، Testing، اور Evaluation

### Debugging Tools:
- ROS 2 logging  
- `rqt` tools: `rqt_graph`, `rqt_console`, `rqt_plot`, `rqt_image_view`  
- Gazebo GUI اور RViz2  

### Testing:
- **Unit Tests:** ASR, NLU, IK solver, perception  
- **Integration Tests:** Voice → Navigation → Perception → Manipulation  

### Metrics:
- Responsiveness  
- Success rate  
- Efficiency  
- Robustness  

---

## 8.9 Advanced Extensions (اختیاری)

- Dynamic/multi-room environments  
- Adaptive grasping for unknown objects  
- Force/torque sensing for compliant manipulation  
- Human-like gaze اور gestures  

---

## Learning Outcomes

- End-to-end **autonomous humanoid system** تیار کریں  
- **Voice-command control** (Speech + NLU + Planning) implement کریں  
- Navigation, perception, manipulation سیکھیں اور test کریں  
- Complex robotic systems **debug اور evaluate** کریں

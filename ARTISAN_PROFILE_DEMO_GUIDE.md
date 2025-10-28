# 🎬 Artisan Profile - Feature Demo Guide

## 🚀 Getting Started

### Access the Profile
1. Start the application: `npm run dev`
2. Login as artisan: `artisan@demo.com`
3. Navigate to: `http://localhost:3000/artisan/profile`

---

## 📸 Feature Walkthrough

### 1. Profile Overview (View Mode)
```
╔════════════════════════════════════════════════════╗
║  MySharpJobs                        [Edit Profile] ║
╠════════════════════════════════════════════════════╣
║  [Banner Background - Blue Gradient]               ║
║                                                    ║
║   👤  John Doe                     ● Available     ║
║       📍 Lagos, Nigeria            [Toggle]        ║
║       📞 +234 801 234 5678                        ║
║                                                    ║
║   📊  5 Years  |  ₦5,000/hr  |  8 Skills  |  10km ║
╠════════════════════════════════════════════════════╣
║  About Me                                          ║
║  Professional carpenter with 5+ years...          ║
╠════════════════════════════════════════════════════╣
║  Skills              |  Certifications            ║
║  [Carpentry]        |  ✓ Advanced Woodworking     ║
║  [Furniture]        |  ✓ Furniture Design         ║
╠════════════════════════════════════════════════════╣
║  Portfolio                                         ║
║  [img] [img] [img] [img]                          ║
╚════════════════════════════════════════════════════╝
```

### 2. Edit Mode Active
```
╔════════════════════════════════════════════════════╗
║  MySharpJobs              [Cancel] [Save Changes]  ║
╠════════════════════════════════════════════════════╣
║  [Banner Background]                               ║
║                                                    ║
║   👤 [📷]  [Name_______]           ● Available     ║
║           [📍Location_]            [Toggle]        ║
║           [📞Phone_____]                          ║
║                                                    ║
║   📊  [5]Years | [₦5000]/hr | 8 Skills | [10]km  ║
╠════════════════════════════════════════════════════╣
║  About Me                                          ║
║  [                                                ]║
║  [  Large text area for bio...                   ]║
║  [                                                ]║
╠════════════════════════════════════════════════════╣
║  Skills         [+]    |  Certifications     [+]  ║
║  [Carpentry] [×]       |  ✓ Advanced [🗑️]         ║
║  [Furniture] [×]       |  ✓ Furniture [🗑️]        ║
╠════════════════════════════════════════════════════╣
║  Portfolio                        [Upload Images]  ║
║  [img] [🗑️] [img] [🗑️] [img] [🗑️] [img] [🗑️]      ║
╚════════════════════════════════════════════════════╝
```

---

## 🎯 Detailed Feature Demos

### Demo 1: Edit Basic Information
**Steps**:
1. Click **"Edit Profile"**
2. Click on name → Type new name → See changes
3. Update phone → See instant formatting
4. Update location → See in header
5. Click **"Save Changes"**
6. See success toast: "Profile updated successfully!"

**Expected Result**: All changes persist and display in view mode

---

### Demo 2: Upload Profile Picture
**Steps**:
1. Click **"Edit Profile"**
2. Hover over profile picture
3. Click **camera icon** 📷
4. Select image from computer
5. See instant preview
6. *(Auto-saved, no manual save needed)*

**Validation**:
- ❌ File > 5MB → Error: "Image size must be less than 5MB"
- ❌ Non-image → Error: "Please upload a valid image file"
- ✅ Valid image → Success: "Profile picture updated!"

---

### Demo 3: Manage Skills
**Steps**:
1. Click **"Edit Profile"**
2. Click **[+]** button next to "Skills"
3. Enter skill name: "Plumbing"
4. Select level: "Expert"
5. Click **"Add"**
6. See new skill badge appear
7. Click **[×]** on any skill to remove
8. Click **"Save Changes"**

**Features**:
- Skill levels: Beginner, Intermediate, Expert
- Visual badges with level indicator
- Instant add/remove
- Empty state when no skills

---

### Demo 4: Add Certifications
**Steps**:
1. Click **"Edit Profile"**
2. Click **"+ Add"** next to "Certifications"
3. Fill in form:
   ```
   Name: "Master Craftsman Certificate"
   Issuer: "Lagos Craftsman Guild"
   Date: "2020-05-15"
   ```
4. Click **"Add Certification"**
5. See certification appear with ✓ icon
6. Click 🗑️ to remove any certification
7. Click **"Save Changes"**

**Features**:
- Date formatting (May 15, 2020)
- Green checkmark icon
- Inline form with validation
- Delete confirmation

---

### Demo 5: Build Portfolio
**Steps**:
1. Click **"Edit Profile"**
2. Click **"Upload Images"** in Portfolio section
3. Select multiple images (Ctrl+Click)
4. See images upload with progress
5. Success toast: "Portfolio images uploaded successfully!"
6. Hover over any image
7. Click 🗑️ icon to delete
8. Confirm deletion

**Validation**:
- Max 10 images total
- 5MB per image
- Shows count: "9 of 10 images"
- Empty state with upload prompt

---

### Demo 6: Update Stats
**Steps**:
1. Click **"Edit Profile"**
2. Update experience: `5` → `8` years
3. Update hourly rate: `₦5,000` → `₦7,500`
4. Update service radius: `10km` → `25km`
5. Click **"Save Changes"**
6. See stats update in header

**Range Validation**:
- Experience: 0-100 years
- Hourly Rate: ₦0 minimum
- Service Radius: 5-100 km

---

### Demo 7: Toggle Availability
**Steps**:
1. Toggle switch from **ON** → **OFF**
2. See instant change
3. See toast: "You are now unavailable"
4. Toggle back **OFF** → **ON**
5. See toast: "You are now available for jobs"

**Features**:
- Instant API sync
- No save button needed
- Visual indicator changes
- Status text updates

---

### Demo 8: Edit Bio
**Steps**:
1. Click **"Edit Profile"**
2. Click in bio textarea
3. Type comprehensive description:
   ```
   Professional carpenter with 8+ years of experience 
   in custom furniture design and installation. 
   Specializing in modern and traditional woodworking 
   techniques. Licensed and insured.
   ```
4. Character count updates: `245 / 1000`
5. Click **"Save Changes"**
6. Bio displays with formatting

---

## ⚠️ Error Handling Demos

### Error Demo 1: Image Too Large
**Steps**:
1. Try to upload 10MB image
2. See error toast: "Image size must be less than 5MB"
3. Upload fails gracefully

### Error Demo 2: Invalid File Type
**Steps**:
1. Try to upload `.pdf` file as avatar
2. See error: "Please upload a valid image file"
3. File selector closes, no changes

### Error Demo 3: Empty Required Field
**Steps**:
1. Click **"+ Add"** for skills
2. Leave name empty
3. Click "Add"
4. See error: "Please enter a skill name"
5. Form stays open

### Error Demo 4: Network Error
**Steps**:
1. Turn off backend server
2. Try to save changes
3. See error: "Failed to update profile"
4. Changes not saved

---

## 💡 Pro Tips

### Tip 1: Cancel Without Losing Work
- Click "Cancel" anytime to discard ALL changes
- Original data restored from API

### Tip 2: Batch Updates
- Make multiple changes before saving
- Single save operation for all edits
- More efficient than saving each change

### Tip 3: Portfolio Showcase
- Upload high-quality images
- Show variety of work
- Update regularly with new projects

### Tip 4: Skill Levels
- Be honest about proficiency
- Update as you learn
- "Expert" level attracts premium jobs

### Tip 5: Bio Writing
- Keep it concise (100-500 chars)
- Highlight unique skills
- Mention certifications
- Include years of experience

---

## 📊 Success Indicators

### Visual Feedback
✅ Green toast = Success  
❌ Red toast = Error  
⏳ Spinner = Loading  
📝 Blue border = Editable field  

### State Changes
👁️ View Mode = Clean display  
✏️ Edit Mode = Editable fields  
💾 Saving = "Saving..." in button  
✅ Saved = Brief success message  

---

## 🎬 Full Workflow Demo

### Complete Profile Update (5 minutes)

```
Start → Login as Artisan
  ↓
Navigate to Profile
  ↓
Click "Edit Profile"
  ↓
Update Personal Info (name, phone, location)
  ↓
Upload New Profile Picture
  ↓
Edit Bio (add experience description)
  ↓
Add 3 New Skills (with levels)
  ↓
Add 2 Certifications (with dates)
  ↓
Upload 5 Portfolio Images
  ↓
Update Stats (experience, rate, radius)
  ↓
Toggle Availability
  ↓
Click "Save Changes"
  ↓
See Success Toast
  ↓
Profile Updated! ✅
```

---

## 🎉 Demo Complete!

Your artisan profile is now fully editable with:
- ✅ Real-time API integration
- ✅ Comprehensive validation
- ✅ Professional UI/UX
- ✅ Mobile responsive
- ✅ Error handling
- ✅ Loading states

**Ready for Production**: ✅ YES

---

**Need Help?** Check `ARTISAN_PROFILE_USER_GUIDE.md` for detailed instructions!

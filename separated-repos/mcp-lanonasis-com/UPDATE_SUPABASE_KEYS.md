# 🔑 Update Supabase API Keys

Your Supabase API keys may be expired or need refreshing. Follow these steps:

## 📋 **Get Fresh API Keys**

### **Method 1: Supabase Dashboard**
1. **Open**: https://supabase.com/dashboard/project/mxtsdgkwzjzlttpotole
2. **Navigate**: Settings → API
3. **Copy keys**:
   - **Project URL**: `https://mxtsdgkwzjzlttpotole.supabase.co`
   - **Anon (public) key**: `eyJ...` 
   - **Service role (secret) key**: `eyJ...`

### **Method 2: Supabase CLI**
```bash
# Login to Supabase
supabase login

# Get project keys
supabase projects api-keys --project-ref mxtsdgkwzjzlttpotole
```

## 🔧 **Update Environment Files**

Replace the keys in these files:

### **Development (.env)**
```env
SUPABASE_URL=https://mxtsdgkwzjzlttpotole.supabase.co
SUPABASE_KEY=[NEW_ANON_KEY]
SUPABASE_SERVICE_KEY=[NEW_SERVICE_ROLE_KEY]
```

### **Production (.env.production)**
```env
SUPABASE_URL=https://mxtsdgkwzjzlttpotole.supabase.co
SUPABASE_KEY=[NEW_ANON_KEY]
SUPABASE_SERVICE_KEY=[NEW_SERVICE_ROLE_KEY]
```

## ✅ **Test Connection**

After updating keys:
```bash
# Test connection
curl -H "apikey: [NEW_ANON_KEY]" \
     -H "Authorization: Bearer [NEW_ANON_KEY]" \
     "https://mxtsdgkwzjzlttpotole.supabase.co/rest/v1/"

# Expected: Empty JSON array or table list, not error
```

## 🔐 **Security Notes**

- **Never commit** real API keys to git
- **Use environment variables** for all keys
- **Rotate keys** regularly for production
- **Restrict key permissions** if possible

## 🚨 **Current Status**

Current API key is returning: `"Invalid API key"`

**Action Required**: Get fresh keys from Supabase dashboard and update environment files.

Once updated, the orchestrator will be able to connect to Supabase and perform memory operations!
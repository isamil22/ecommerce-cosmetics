# Which Setup Am I Using?

## 🤔 Two Ways to Run This Project

You can run this e-commerce project in **two different ways**. Here's how to know which one you're using:

---

## 🐳 Setup 1: Docker (Production-like)

### How to Know You're Using This:
- ✅ You ran: `docker-compose up`
- ✅ Frontend URL: `http://localhost:8081`
- ✅ Backend URL: `http://localhost:8082`
- ✅ Everything runs in containers

### Advantages:
- 🎯 Closer to production environment
- 🎯 Everything isolated in containers
- 🎯 Easy to deploy
- 🎯 Consistent across different computers

### To Fix Registration Issue:
```powershell
# Run this script:
.\docker-rebuild.ps1

# OR manually:
docker-compose down
docker-compose build frontend
docker-compose up -d
```

### When to Use Docker:
- When testing production-like environment
- When you want isolated setup
- When deploying to servers
- When you don't want to install Java/Node locally

---

## 💻 Setup 2: Development Mode (Local)

### How to Know You're Using This:
- ✅ You ran: `npm run dev` in frontend folder
- ✅ Frontend URL: `http://localhost:5173`
- ✅ Backend URL: `http://localhost:8080`
- ✅ Only database in Docker

### Advantages:
- 🎯 Faster development (hot reload)
- 🎯 Easier debugging
- 🎯 See changes instantly
- 🎯 Better for active development

### To Fix Registration Issue:
```powershell
# 1. Clear cache:
.\clear-cache.ps1

# 2. Restart frontend:
cd frontend
npm run dev
```

### When to Use Development Mode:
- When actively coding
- When testing features quickly
- When debugging
- When you want instant feedback

---

## 📊 Quick Comparison

| Feature | Docker | Development |
|---------|--------|-------------|
| Frontend Port | 8081 | 5173 |
| Backend Port | 8082 | 8080 |
| Hot Reload | ❌ No | ✅ Yes |
| Setup Time | Slower | Faster |
| Production-like | ✅ Yes | ❌ No |
| Debugging | Harder | Easier |
| After Code Change | Rebuild container | Auto-refresh |

---

## 🎯 Which Should You Use?

### Use Docker When:
- ✅ Testing final build
- ✅ Deploying to server
- ✅ Sharing with others
- ✅ Want consistent environment

### Use Development Mode When:
- ✅ Writing code
- ✅ Testing features
- ✅ Debugging issues
- ✅ Want fast feedback

---

## 🔄 How to Switch Between Them

### Currently Using Docker → Want Development Mode:

```powershell
# 1. Stop Docker
docker-compose down

# 2. Start database only (you still need this!)
docker-compose up -d db

# 3. Start backend locally
cd demo
mvn spring-boot:run

# 4. Start frontend locally (in new terminal)
cd frontend
npm run dev

# Now access at: http://localhost:5173
```

### Currently Using Development → Want Docker:

```powershell
# 1. Stop local servers (Ctrl+C in terminals)

# 2. Start Docker
docker-compose up -d

# Now access at: http://localhost:8081
```

---

## 🚀 Recommended Workflow

### For Active Development:
1. Use **Development Mode** while coding
2. Test in **Docker** before committing
3. Deploy using **Docker**

### For Your Current Registration Issue:

**If using Docker (port 8081):**
```powershell
.\docker-rebuild.ps1
```

**If using Development (port 5173):**
```powershell
.\clear-cache.ps1
cd frontend
npm run dev
```

---

## 💡 Pro Tip: Check Which One You're Using

```powershell
# Run this to see what's running:
.\quick-start.ps1

# Or check manually:
# Docker running? 
docker-compose ps

# Frontend dev server running?
# Check if anything on port 5173
netstat -ano | findstr :5173
```

---

## ✅ Summary

| Setup | URL | Fix Command |
|-------|-----|-------------|
| **Docker** | http://localhost:8081 | `.\docker-rebuild.ps1` |
| **Development** | http://localhost:5173 | `.\clear-cache.ps1` then `npm run dev` |

**Based on your error showing port 8081, you're using Docker!** 🐳

**So run:** `.\docker-rebuild.ps1`


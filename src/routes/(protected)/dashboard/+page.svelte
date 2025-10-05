<script lang="ts">
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { Button, Card, StatusBadge } from "$lib/components/ui";
  import { 
    Plus, 
    Users, 
    Ruler, 
    ShoppingBag, 
    TrendingUp,
    Eye,
    ArrowUpRight,
    Package,
    Clock,
    ArrowRight,
    FileText,
    UserPlus
  } from "lucide-svelte";
  import type { PageData } from "./$types";
  
  let { data }: { data: PageData } = $props();
  
  // Loading state (untuk demo skeleton)
  let isLoading = $state(false);
  
  // Animated counter
  function animateCounter(target: number, duration: number = 1000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
    }, 16);
    return current;
  }
  
  // Counter values with animation
  let ordersCount = $state(0);
  let customersCount = $state(0);
  let templatesCount = $state(0);
  
  // Animate on mount
  $effect(() => {
    const interval = setInterval(() => {
      if (ordersCount < data.totalOrders) {
        ordersCount = Math.min(ordersCount + Math.ceil(data.totalOrders / 50), data.totalOrders);
      }
      if (customersCount < 0) customersCount = 0;
      if (templatesCount < 0) templatesCount = 0;
    }, 20);
    
    return () => clearInterval(interval);
  });
</script>

<style>
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  :global(.stat-card) {
    animation: slideInUp 0.6s ease-out forwards;
    position: relative;
    overflow: hidden;
  }
  
  :global(.stat-card:nth-child(1)) {
    animation-delay: 0.1s;
    opacity: 0;
  }
  
  :global(.stat-card:nth-child(2)) {
    animation-delay: 0.2s;
    opacity: 0;
  }
  
  :global(.stat-card:nth-child(3)) {
    animation-delay: 0.3s;
    opacity: 0;
  }
  
  :global(.stat-card::before) {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s;
  }
  
  :global(.stat-card:hover::before) {
    left: 100%;
  }
  
  .quick-action {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }
  
  :global(.stat-card:hover .quick-action) {
    opacity: 1;
    transform: translateY(0);
  }
  
  .mini-chart {
    height: 40px;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    opacity: 0.6;
  }
  
  .mini-chart-bar {
    flex: 1;
    background: currentColor;
    border-radius: 2px 2px 0 0;
    transition: all 0.3s ease;
  }
  
  :global(.stat-card:hover .mini-chart-bar) {
    opacity: 1;
  }
  
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  
  .icon-bounce:hover {
    animation: bounce 0.6s ease;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
</style>

<div class="min-h-screen bg-base-200/30">
  <PageHeader 
    title="Dashboard" 
    subtitle="Selamat datang kembali! Berikut ringkasan aktivitas bisnis Anda hari ini.">
    {#snippet actions()}
      <Button onclick={() => alert('Add new item')}>
        <Plus class="h-4 w-4" />
        Tambah Pesanan
      </Button>
    {/snippet}
  </PageHeader>

  <!-- Stats Section -->
  <section class="mb-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total Orders Card -->
      <Card class="stat-card bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 hover:scale-105">
        <div class="card-body p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-2 bg-primary/20 rounded-lg icon-bounce">
                  <ShoppingBag class="h-5 w-5 text-primary" />
                </div>
                <h3 class="text-sm font-medium text-base-content/70">Total Pesanan</h3>
              </div>
              <p class="text-4xl font-bold text-base-content mb-2 transition-all duration-300">
                {ordersCount}
              </p>
              <div class="flex items-center gap-1 text-success text-sm mb-3 h-5">
                <TrendingUp class="h-3 w-3" />
                <span>+12% dari bulan lalu</span>
              </div>
              
              <!-- Mini Chart -->
              <div class="mini-chart text-primary mt-4">
                <div class="mini-chart-bar" style="height: 60%;"></div>
                <div class="mini-chart-bar" style="height: 80%;"></div>
                <div class="mini-chart-bar" style="height: 45%;"></div>
                <div class="mini-chart-bar" style="height: 90%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 100%;"></div>
                <div class="mini-chart-bar" style="height: 85%;"></div>
              </div>
            </div>
            <div class="badge badge-primary badge-sm">Aktif</div>
          </div>
          
          <!-- Quick Action -->
          <div class="quick-action">
            <Button size="sm" variant="ghost" class="w-full justify-between group">
              <span>Lihat Detail</span>
              <ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>

      <!-- Total Customers Card -->
      <Card class="stat-card bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-300 hover:-translate-y-2 hover:scale-105">
        <div class="card-body p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-2 bg-secondary/20 rounded-lg icon-bounce">
                  <Users class="h-5 w-5 text-secondary" />
                </div>
                <h3 class="text-sm font-medium text-base-content/70">Total Pelanggan</h3>
              </div>
              <p class="text-4xl font-bold text-base-content mb-2 transition-all duration-300">
                {customersCount}
              </p>
              <div class="flex items-center gap-1 text-base-content/60 text-sm mb-3">
                <span>Pelanggan terdaftar</span>
              </div>
              
              <!-- Mini Chart -->
              <div class="mini-chart text-secondary mt-4">
                <div class="mini-chart-bar" style="height: 40%;"></div>
                <div class="mini-chart-bar" style="height: 55%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 60%;"></div>
                <div class="mini-chart-bar" style="height: 85%;"></div>
                <div class="mini-chart-bar" style="height: 75%;"></div>
                <div class="mini-chart-bar" style="height: 90%;"></div>
              </div>
            </div>
            <div class="badge badge-secondary badge-sm">Data</div>
          </div>
          
          <!-- Quick Action -->
          <div class="quick-action">
            <Button size="sm" variant="ghost" class="w-full justify-between group">
              <span>Tambah Pelanggan</span>
              <UserPlus class="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>

      <!-- Total Templates Card -->
      <Card class="stat-card bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-2 hover:scale-105">
        <div class="card-body p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-2 bg-accent/20 rounded-lg icon-bounce">
                  <Ruler class="h-5 w-5 text-accent" />
                </div>
                <h3 class="text-sm font-medium text-base-content/70">Total Template</h3>
              </div>
              <p class="text-4xl font-bold text-base-content mb-2 transition-all duration-300">
                {templatesCount}
              </p>
              <div class="flex items-center gap-1 text-base-content/60 text-sm mb-3">
                <span>Template pengukuran</span>
              </div>
              
              <!-- Mini Chart -->
              <div class="mini-chart text-accent mt-4">
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
                <div class="mini-chart-bar" style="height: 70%;"></div>
              </div>
            </div>
            <div class="badge badge-accent badge-sm">Template</div>
          </div>
          
          <!-- Quick Action -->
          <div class="quick-action">
            <Button size="sm" variant="ghost" class="w-full justify-between group">
              <span>Kelola Template</span>
              <FileText class="h-4 w-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </section>

  <!-- Recent Orders Section -->
  <section class="mt-12">
    <Card class="bg-base-100 border-base-300 shadow-xl">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Package class="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-base-content">Pesanan Terbaru</h2>
              <p class="text-sm text-base-content/60">Daftar pesanan yang baru masuk</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" class="gap-2">
            Lihat Semua
            <ArrowUpRight class="h-4 w-4" />
          </Button>
        </div>

        <div class="overflow-x-auto">
          {#if isLoading}
            <!-- Loading Skeleton -->
            <table class="table w-full">
              <thead>
                <tr class="border-base-300">
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <ShoppingBag class="h-4 w-4 text-base-content/50" />
                      No. Pesanan
                    </div>
                  </th>
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <Users class="h-4 w-4 text-base-content/50" />
                      Pelanggan
                    </div>
                  </th>
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <Package class="h-4 w-4 text-base-content/50" />
                      Status
                    </div>
                  </th>
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <Clock class="h-4 w-4 text-base-content/50" />
                      Tanggal
                    </div>
                  </th>
                  <th class="bg-base-200/50 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each Array(5) as _, i}
                  <tr>
                    <td><div class="skeleton h-4 w-24 rounded"></div></td>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="skeleton h-10 w-10 rounded-full"></div>
                        <div class="space-y-2">
                          <div class="skeleton h-4 w-32 rounded"></div>
                          <div class="skeleton h-3 w-24 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td><div class="skeleton h-6 w-20 rounded-full"></div></td>
                    <td>
                      <div class="space-y-2">
                        <div class="skeleton h-4 w-24 rounded"></div>
                        <div class="skeleton h-3 w-16 rounded"></div>
                      </div>
                    </td>
                    <td class="text-right">
                      <div class="skeleton h-8 w-20 rounded ml-auto"></div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {:else}
            <!-- Actual Table -->
            <table class="table w-full">
              <thead>
                <tr class="border-base-300">
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <ShoppingBag class="h-4 w-4 text-base-content/50" />
                      No. Pesanan
                    </div>
                  </th>
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <Users class="h-4 w-4 text-base-content/50" />
                      Pelanggan
                    </div>
                  </th>
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <Package class="h-4 w-4 text-base-content/50" />
                      Status
                    </div>
                  </th>
                  <th class="bg-base-200/50">
                    <div class="flex items-center gap-2">
                      <Clock class="h-4 w-4 text-base-content/50" />
                      Tanggal
                    </div>
                  </th>
                  <th class="bg-base-200/50 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each data.recentOrders as order}
                  <tr class="hover:bg-base-200/30 transition-all duration-200 hover:scale-[1.01]">
                    <td>
                      <div class="font-semibold text-primary">{order.order_number}</div>
                    </td>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar placeholder">
                          <div class="bg-primary/10 text-primary rounded-full w-10 h-10 transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                            <span class="text-sm font-semibold">
                              {order.customer?.name?.charAt(0).toUpperCase() || 'N'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div class="font-medium">{order.customer?.name || 'N/A'}</div>
                          <div class="text-sm text-base-content/60">
                            {order.customer?.phone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="badge badge-primary">
                        {order.status}
                      </div>
                    </td>
                    <td>
                      <div class="text-sm">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}
                      </div>
                      <div class="text-xs text-base-content/50">
                        {order.created_at ? new Date(order.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </div>
                    </td>
                    <td class="text-right">
                      <Button size="sm" variant="ghost" class="group hover:bg-primary/10 hover:text-primary">
                        <Eye class="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                {:else}
                  <tr>
                    <td colspan="5" class="text-center py-12">
                      <div class="flex flex-col items-center gap-3">
                        <div class="p-4 bg-base-200 rounded-full">
                          <ShoppingBag class="h-8 w-8 text-base-content/30" />
                        </div>
                        <div>
                          <p class="font-medium text-base-content/70">Belum ada pesanan</p>
                          <p class="text-sm text-base-content/50">Pesanan akan muncul di sini setelah dibuat</p>
                        </div>
                        <Button size="sm" class="mt-2">
                          <Plus class="h-4 w-4" />
                          Buat Pesanan Pertama
                        </Button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </div>
      </div>
    </Card>
  </section>
</div>

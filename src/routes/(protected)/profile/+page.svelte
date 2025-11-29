<script lang="ts">
    import { enhance } from "$app/forms";
    import PageHeader from "$lib/components/layout/PageHeader.svelte";
    import { Button, Card } from "$lib/components/ui";
    import {
        User,
        Lock,
        History,
        Save,
        AlertCircle,
        CheckCircle2,
    } from "lucide-svelte";
    import type { ActionData, PageData } from "./$types";

    let { data, form }: { data: PageData; form: ActionData } = $props();

    let isSubmitting = $state(false);
    let currentPassword = $state("");
    let newPassword = $state("");
    let confirmPassword = $state("");

    // Toast state
    let toast = $state<{
        show: boolean;
        message: string;
        type: "success" | "error";
    }>({
        show: false,
        message: "",
        type: "success",
    });

    function showToast(message: string, type: "success" | "error") {
        toast = { show: true, message, type };
        setTimeout(() => {
            toast.show = false;
        }, 3000);
    }

    // React to form actions
    $effect(() => {
        if (form) {
            if (form.success) {
                showToast(form.message || "Berhasil", "success");
                // Reset form fields
                currentPassword = "";
                newPassword = "";
                confirmPassword = "";
            } else if (form.message) {
                showToast(form.message, "error");
            }
        }
    });
</script>

<div class="min-h-screen bg-base-200/30">
    <!-- Toast Notification -->
    {#if toast.show}
        <div class="toast toast-top toast-end z-50">
            <div
                class="alert {toast.type === 'success'
                    ? 'alert-success'
                    : 'alert-error'} shadow-lg"
            >
                <div class="flex items-center gap-2">
                    {#if toast.type === "success"}
                        <CheckCircle2 class="h-5 w-5" />
                    {:else}
                        <AlertCircle class="h-5 w-5" />
                    {/if}
                    <span>{toast.message}</span>
                </div>
            </div>
        </div>
    {/if}

    <PageHeader
        title="Profil Pengguna"
        subtitle="Kelola informasi akun dan keamanan Anda"
    />

    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: User Info -->
            <div class="lg:col-span-1 space-y-6">
                <Card class="bg-base-100 border-base-300 shadow-sm">
                    <div class="card-body items-center text-center p-8">
                        <div class="avatar placeholder mb-4">
                            <div
                                class="bg-primary text-primary-content rounded-full w-24 h-24 text-3xl font-bold ring ring-primary ring-offset-base-100 ring-offset-2"
                            >
                                <span
                                    >{data.user.username
                                        .charAt(0)
                                        .toUpperCase()}</span
                                >
                            </div>
                        </div>
                        <h2 class="card-title text-2xl">
                            {data.user.username}
                        </h2>
                        <div class="badge badge-secondary mt-2">
                            Administrator
                        </div>

                        <div class="divider my-4"></div>

                        <div class="w-full text-left space-y-4">
                            <div
                                class="flex items-center gap-3 text-base-content/70"
                            >
                                <User class="h-5 w-5" />
                                <span class="font-medium">Username:</span>
                                <span class="ml-auto">{data.user.username}</span
                                >
                            </div>
                            <div
                                class="flex items-center gap-3 text-base-content/70"
                            >
                                <History class="h-5 w-5" />
                                <span class="font-medium">Login Terakhir:</span>
                            </div>
                            <div
                                class="text-sm text-right text-base-content/60 bg-base-200 p-2 rounded"
                            >
                                {data.user.lastLogin
                                    ? new Date(
                                          data.user.lastLogin,
                                      ).toLocaleString("id-ID", {
                                          dateStyle: "full",
                                          timeStyle: "medium",
                                      })
                                    : "Belum pernah login"}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Right Column: Change Password -->
            <div class="lg:col-span-2">
                <Card class="bg-base-100 border-base-300 shadow-sm h-full">
                    <div class="card-body p-6">
                        <div class="flex items-center gap-3 mb-6">
                            <div
                                class="p-3 bg-warning/10 rounded-lg text-warning"
                            >
                                <Lock class="h-6 w-6" />
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">
                                    Ganti Password
                                </h3>
                                <p class="text-sm text-base-content/60">
                                    Perbarui password akun Anda secara berkala
                                    untuk keamanan.
                                </p>
                            </div>
                        </div>

                        <form
                            method="POST"
                            action="?/changePassword"
                            use:enhance={() => {
                                isSubmitting = true;
                                return async ({ update }) => {
                                    await update();
                                    isSubmitting = false;
                                };
                            }}
                            class="space-y-6 max-w-lg"
                        >
                            <div class="form-control w-full">
                                <label class="label" for="currentPassword">
                                    <span class="label-text font-medium"
                                        >Password Saat Ini</span
                                    >
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    bind:value={currentPassword}
                                    placeholder="Masukkan password saat ini"
                                    class="input input-bordered w-full focus:input-primary transition-all"
                                    required
                                />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="form-control w-full">
                                    <label class="label" for="newPassword">
                                        <span class="label-text font-medium"
                                            >Password Baru</span
                                        >
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        bind:value={newPassword}
                                        placeholder="Minimal 6 karakter"
                                        class="input input-bordered w-full focus:input-primary transition-all"
                                        minlength="6"
                                        required
                                    />
                                </div>

                                <div class="form-control w-full">
                                    <label class="label" for="confirmPassword">
                                        <span class="label-text font-medium"
                                            >Konfirmasi Password</span
                                        >
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        bind:value={confirmPassword}
                                        placeholder="Ulangi password baru"
                                        class="input input-bordered w-full focus:input-primary transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {#if newPassword && confirmPassword && newPassword !== confirmPassword}
                                <div class="alert alert-error text-sm py-2">
                                    <AlertCircle class="h-4 w-4" />
                                    <span
                                        >Password baru dan konfirmasi tidak
                                        cocok</span
                                    >
                                </div>
                            {/if}

                            <div class="pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    class="w-full md:w-auto min-w-[150px]"
                                    disabled={isSubmitting ||
                                        (newPassword !== confirmPassword &&
                                            confirmPassword.length > 0)}
                                >
                                    {#if isSubmitting}
                                        <span
                                            class="loading loading-spinner loading-sm"
                                        ></span>
                                        Menyimpan...
                                    {:else}
                                        <Save class="h-4 w-4 mr-2" />
                                        Simpan Password Baru
                                    {/if}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</div>

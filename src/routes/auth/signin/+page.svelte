<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { Lock, User } from "lucide-svelte";
    import { redirect } from "@sveltejs/kit";
    import type { Page } from "@sveltejs/kit";

    let username = "";
    let password = "";
    let error = "";
    let loading = false;

    // Cek jika pengguna sudah login
    onMount(async () => {
        const currentPage = $page as Page;
        const url = new URL(currentPage.url);
        const callbackUrl = url.searchParams.get("callbackUrl");

        // Jika sudah ada callbackUrl, arahkan ke halaman yang diminta
        if (callbackUrl) {
            // Logic untuk redirect akan ditangani oleh Auth.js
        }
    });

    async function handleSubmit() {
        loading = true;
        error = "";

        try {
            // Form submission akan ditangani oleh Auth.js
            // Kita hanya perlu memastikan form memiliki struktur yang benar
        } catch (err) {
            error = "Terjadi kesalahan saat login. Silakan coba lagi.";
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8"
>
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2
                class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
            >
                Masuk ke Akun Anda
            </h2>
            <p
                class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
            >
                Masukkan kredensial admin untuk mengakses dashboard
            </p>
        </div>

        {#if error}
            <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">
                            {error}
                        </h3>
                    </div>
                </div>
            </div>
        {/if}

        <form
            class="mt-8 space-y-6"
            method="POST"
            use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === "success") {
                        // Redirect akan ditangani oleh Auth.js
                    } else {
                        error =
                            "Username atau password salah. Silakan coba lagi.";
                    }
                };
            }}
        >
            <input type="hidden" name="remember" value="true" />
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="username" class="sr-only">Username</label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <User class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            class="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="Username"
                            bind:value={username}
                        />
                    </div>
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Lock class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            class="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="Password"
                            bind:value={password}
                        />
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
                    />
                    <label
                        for="remember-me"
                        class="ml-2 block text-sm text-gray-900 dark:text-white"
                    >
                        Ingat saya
                    </label>
                </div>

                <div class="text-sm">
                    <a
                        href="#"
                        on:click|preventDefault={() => {}}
                        class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        Lupa password?
                    </a>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                    disabled={loading}
                >
                    {#if loading}
                        <svg
                            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Memproses...
                    {:else}
                        Masuk
                    {/if}
                </button>
            </div>
        </form>

        <div class="mt-6">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div
                        class="w-full border-t border-gray-300 dark:border-gray-700"
                    ></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span
                        class="px-2 bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                    >
                        Aplikasi Tiket Jahit
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<script lang="ts">
    import { Lock, User, Eye, EyeOff } from "lucide-svelte";
    import { signIn } from "@auth/sveltekit/client";

    let username = "";
    let password = "";
    let error = "";
    let loading = false;
    let showPassword = false;

    function toggleShowPassword() {
        showPassword = !showPassword;
    }

    async function handleSubmit(event: Event) {
        event.preventDefault(); // Manually prevent default for Svelte 5
        loading = true;
        error = "";
        try {
            await signIn("credentials", {
                username,
                password,
                redirectTo: "/",
            });
        } catch (e: any) {
            error = e.message || "Username atau password salah. Silakan coba lagi.";
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
            onsubmit={handleSubmit}
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
                            type={showPassword ? 'text' : 'password'}
                            required
                            class="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                            placeholder="Password"
                            bind:value={password}
                        />
                        <button
                            type="button"
                            onclick={toggleShowPassword}
                            class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none z-10"
                            tabindex="-1"
                        >
                            {#if showPassword}
                                <EyeOff class="h-5 w-5 text-gray-400" />
                            {:else}
                                <Eye class="h-5 w-5 text-gray-400" />
                            {/if}
                        </button>
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
                        href="/auth/forgot-password"
                        onclick={(e) => {
                            e.preventDefault();
                            alert('Fitur ini belum tersedia.');
                        }}
                        class="font-medium text-primary-600/50 cursor-not-allowed"
                    >
                        Lupa password?
                    </a>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="btn btn-primary btn-block {loading ? 'btn-disabled' : ''}"
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

            {#if import.meta.env.DEV}
                <div class="mt-6 text-center text-sm">
                    <a href="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
                        Belum punya akun? Daftar di sini.
                    </a>
                </div>
            {/if}
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

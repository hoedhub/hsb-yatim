<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Customer } from "$lib/server/db/schema";

	let {
		data = null,
		action = "?/create",
		onClose,
	} = $props<{
		data?: Customer | null;
		action?: string;
		onClose: () => void;
	}>();

	let name = $state(data?.name ?? "");
	let type = $state<"individual" | "institution">(data?.type ?? "individual");
	let institution_name = $state(data?.institution_name ?? "");
	let phone = $state(data?.phone ?? "");
	let address = $state(data?.address ?? "");
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === "success") {
				onClose();
				await update();
			}
		};
	}}
	class="space-y-4"
>
	{#if data?.id}
		<input type="hidden" name="id" value={data.id} />
	{/if}

	<div class="form-control w-full">
		<label class="label" for="name">
			<span class="label-text"
				>{type === "institution" ? "Nama Institusi" : "Nama"}</span
			>
		</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={name}
			placeholder={type === "institution"
				? "Nama institusi/perusahaan"
				: "Nama customer"}
			class="input input-bordered w-full"
			required
			minlength="2"
		/>
	</div>

	<div class="form-control w-full">
		<label class="label" for="type">
			<span class="label-text">Tipe</span>
		</label>
		<select
			id="type"
			name="type"
			bind:value={type}
			class="select select-bordered w-full"
		>
			<option value="individual">Perorangan</option>
			<option value="institution">Institusi</option>
		</select>
	</div>

	{#if type === "institution"}
		<div class="form-control w-full">
			<label class="label" for="institution_name">
				<span class="label-text">Nama Kontak Person (Opsional)</span>
			</label>
			<input
				type="text"
				id="institution_name"
				name="institution_name"
				bind:value={institution_name}
				placeholder="Nama orang yang dihubungi"
				class="input input-bordered w-full"
			/>
		</div>
	{/if}

	<div class="form-control w-full">
		<label class="label" for="phone">
			<span class="label-text">Telepon (Opsional)</span>
		</label>
		<input
			type="tel"
			id="phone"
			name="phone"
			bind:value={phone}
			placeholder="Nomor telepon"
			class="input input-bordered w-full"
		/>
	</div>

	<div class="form-control w-full">
		<label class="label" for="address">
			<span class="label-text">Alamat (Opsional)</span>
		</label>
		<textarea
			id="address"
			name="address"
			bind:value={address}
			placeholder="Alamat lengkap"
			class="textarea textarea-bordered h-24"
		></textarea>
	</div>

	<div class="modal-action">
		<button type="button" class="btn" onclick={onClose}>Batal</button>
		<button type="submit" class="btn btn-primary">Simpan</button>
	</div>
</form>

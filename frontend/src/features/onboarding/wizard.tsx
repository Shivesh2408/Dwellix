"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { clearOnboardingDraft, createStarterDraft } from "./storage";
import { OnboardingShell } from "./shell";
import { completeOnboarding, OnboardingError } from "./service";
import { homeTypeLabel, validateAppliance, validateHomeDraft, validateRoom, type FieldErrors } from "./validation";
import { useOnboarding } from "./provider";
import type { Appliance, HomeType, OnboardingCompletePayload, Room } from "./types";

const homeTypes: HomeType[] = ["APARTMENT", "VILLA", "INDEPENDENT_HOUSE", "OFFICE"];

const applianceNames = [
  "Air Conditioner",
  "Refrigerator",
  "Television",
  "RO",
  "Microwave",
  "Washing Machine",
  "Fan",
  "Light",
  "Laptop",
  "Desktop",
  "Printer",
];

function fieldError(errors: FieldErrors, field: string) {
  return errors[field];
}

function StepActions({
  backHref,
  backLabel,
  nextHref,
  nextLabel,
  nextDisabled,
  onNext,
  loading,
}: {
  backHref?: string;
  backLabel: string;
  nextHref?: string;
  nextLabel: string;
  nextDisabled?: boolean;
  onNext?: () => void | Promise<void>;
  loading?: boolean;
}) {
  const router = useRouter();
  const nextButton = nextHref ? (
    <Button className="h-11 gap-2" disabled={nextDisabled || loading} onClick={() => router.push(nextHref)}>
      {nextLabel}
      <ChevronRight className="h-4 w-4" />
    </Button>
  ) : (
    <Button type="button" className="h-11 gap-2" onClick={onNext} loading={loading} disabled={nextDisabled}>
      {nextLabel}
      <ChevronRight className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {backHref ? (
        <Button variant="outline" className="h-11 gap-2" onClick={() => router.push(backHref)}>
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      ) : <span />}
      {nextButton}
    </div>
  );
}

function WelcomeStep() {
  const router = useRouter();
  const { replaceDraft } = useOnboarding();

  return (
    <OnboardingShell
      stepIndex={0}
      title="Welcome to Dwellix"
      description="Let’s personalize your home in just a few steps."
      footer={
        <div className="text-center text-sm text-muted-foreground">
          You can come back and edit everything later. The dashboard should never feel empty.
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/60 bg-secondary/30 p-5">
            <div className="text-sm font-semibold">What we’ll collect</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Home profile and address</li>
              <li>Rooms you want to track</li>
              <li>Appliances and warranty dates</li>
            </ul>
          </Card>
          <Card className="border-border/60 bg-secondary/30 p-5">
            <div className="text-sm font-semibold">Why this matters</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>No empty dashboard</li>
              <li>Smarter reminders later</li>
              <li>Structured from the start</li>
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="h-11 gap-2" onClick={() => router.push("/onboarding/home")}>Start Setup</Button>
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={() => {
              replaceDraft(createStarterDraft());
              router.push("/onboarding/home");
            }}
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

function HomeStep() {
  const { draft, updateHomeField } = useOnboarding();
  const errors = useMemo(() => validateHomeDraft(draft), [draft]);

  return (
    <OnboardingShell stepIndex={1} title="Home Information" description="Collect the essentials for your home profile.">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2 block">
            <span className="mb-2 block text-sm font-medium text-foreground">Home Name</span>
            <Input value={draft.homeName} onChange={(event) => updateHomeField("homeName", event.target.value)} error={Boolean(fieldError(errors, "homeName"))} placeholder="Dwellix Home" />
            {fieldError(errors, "homeName") ? <p className="mt-2 text-sm text-destructive">{fieldError(errors, "homeName")}</p> : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">House Type</span>
            <Select value={draft.homeType} onValueChange={(value) => updateHomeField("homeType", value)}>
              <SelectTrigger error={Boolean(fieldError(errors, "homeType"))}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {homeTypes.map((type) => (
                  <SelectItem key={type} value={type}>{homeTypeLabel(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError(errors, "homeType") ? <p className="mt-2 text-sm text-destructive">{fieldError(errors, "homeType")}</p> : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">City</span>
            <Input value={draft.city} onChange={(event) => updateHomeField("city", event.target.value)} error={Boolean(fieldError(errors, "city"))} placeholder="Bengaluru" />
            {fieldError(errors, "city") ? <p className="mt-2 text-sm text-destructive">{fieldError(errors, "city")}</p> : null}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">Address</span>
            <Textarea value={draft.address} onChange={(event) => updateHomeField("address", event.target.value)} error={Boolean(fieldError(errors, "address"))} placeholder="Street, building, area" />
            {fieldError(errors, "address") ? <p className="mt-2 text-sm text-destructive">{fieldError(errors, "address")}</p> : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">State</span>
            <Input value={draft.state} onChange={(event) => updateHomeField("state", event.target.value)} error={Boolean(fieldError(errors, "state"))} placeholder="Karnataka" />
            {fieldError(errors, "state") ? <p className="mt-2 text-sm text-destructive">{fieldError(errors, "state")}</p> : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Pincode</span>
            <Input value={draft.pincode} onChange={(event) => updateHomeField("pincode", event.target.value)} error={Boolean(fieldError(errors, "pincode"))} placeholder="560001" maxLength={6} inputMode="numeric" />
            {fieldError(errors, "pincode") ? <p className="mt-2 text-sm text-destructive">{fieldError(errors, "pincode")}</p> : null}
          </label>
        </div>

        <StepActions backHref="/onboarding" backLabel="Back" nextHref="/onboarding/rooms" nextLabel="Save and Continue" nextDisabled={Object.keys(errors).length > 0} />
      </div>
    </OnboardingShell>
  );
}

function RoomEditorDialog({
  open,
  onOpenChange,
  room,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  onSave: (room: Room) => void;
}) {
  const [name, setName] = useState(room?.name ?? "");
  const [notes, setNotes] = useState(room?.notes ?? "");
  useEffect(() => {
    setTimeout(() => {
      setName(room?.name ?? "");
      setNotes(room?.notes ?? "");
    }, 0);
  }, [room, open]);
  const errors = validateRoom({ name });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "Edit room" : "Add room"}</DialogTitle>
          <DialogDescription>Add the room name and optional notes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Room name</span>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Living Room" error={Boolean(errors.name)} />
            {errors.name ? <p className="mt-2 text-sm text-destructive">{errors.name}</p> : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Notes</span>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional usage note" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (errors.name) return;
              onSave({
                id: room?.id ?? crypto.randomUUID(),
                name,
                notes,
                appliances: room?.appliances ?? [],
              });
              onOpenChange(false);
            }}
          >
            Save room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoomsStep() {
  const { draft, addRoom, updateRoom, deleteRoom } = useOnboarding();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  return (
    <OnboardingShell stepIndex={2} title="Rooms" description="Add, edit, and delete rooms as needed.">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">Examples: Living Room, Kitchen, Bedroom, Bathroom, Balcony, Study Room, Store Room</div>
          <Button onClick={() => { setEditingRoom(null); setEditorOpen(true); }} className="h-11 gap-2">
            <Plus className="h-4 w-4" /> Add Room
          </Button>
        </div>

        <div className="grid gap-4">
          {draft.rooms.map((room) => (
            <Card key={room.id} className="border-border/60 bg-secondary/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{room.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{room.notes || "No notes added"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingRoom(room); setEditorOpen(true); }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteRoom(room.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {room.appliances.length ? room.appliances.map((appliance) => <Badge key={appliance.id} variant="secondary">{appliance.name}</Badge>) : <span className="text-sm text-muted-foreground">No appliances yet.</span>}
              </div>
            </Card>
          ))}
        </div>

        <StepActions backHref="/onboarding/home" backLabel="Back" nextHref="/onboarding/appliances" nextLabel="Continue to Appliances" nextDisabled={draft.rooms.length === 0} />
      </div>

      <RoomEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        room={editingRoom}
        onSave={(room) => {
          if (editingRoom) {
            updateRoom(editingRoom.id, room);
          } else {
            addRoom(room);
          }
        }}
      />
    </OnboardingShell>
  );
}

function ApplianceEditorDialog({
  open,
  onOpenChange,
  roomId,
  rooms,
  appliance,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  rooms: Room[];
  appliance: Appliance | null;
  onSave: (roomId: string, appliance: Appliance) => void;
}) {
  const [targetRoomId, setTargetRoomId] = useState(roomId);
  const [name, setName] = useState(appliance?.name ?? "");
  const [brand, setBrand] = useState(appliance?.brand ?? "");
  const [model, setModel] = useState(appliance?.model ?? "");
  const [purchaseDate, setPurchaseDate] = useState(appliance?.purchaseDate ?? "");
  const [warrantyExpiry, setWarrantyExpiry] = useState(appliance?.warrantyExpiry ?? "");
  const [photoFileName, setPhotoFileName] = useState(appliance?.photoFileName ?? "");
  const [invoiceFileName, setInvoiceFileName] = useState(appliance?.invoiceFileName ?? "");
  const [customName, setCustomName] = useState(false);

  const errors = validateAppliance({ name: name || "", brand, model, purchaseDate, warrantyExpiry });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{appliance ? "Edit appliance" : "Add appliance"}</DialogTitle>
          <DialogDescription>Associate the appliance with a room and capture warranty details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">Room</span>
            <Select value={targetRoomId} onValueChange={setTargetRoomId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {rooms.map((room) => <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Appliance</span>
            <Select value={customName ? "CUSTOM" : name} onValueChange={(value) => {
              if (value === "CUSTOM") {
                setCustomName(true);
                setName("");
                return;
              }
              setCustomName(false);
              setName(value);
            }}>
              <SelectTrigger error={Boolean(errors.name)}><SelectValue placeholder="Choose appliance" /></SelectTrigger>
              <SelectContent>
                {applianceNames.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
            {errors.name ? <p className="mt-2 text-sm text-destructive">{errors.name}</p> : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Brand</span>
            <Input value={brand} onChange={(event) => setBrand(event.target.value)} error={Boolean(errors.brand)} placeholder="Samsung" />
            {errors.brand ? <p className="mt-2 text-sm text-destructive">{errors.brand}</p> : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Model</span>
            <Input value={model} onChange={(event) => setModel(event.target.value)} error={Boolean(errors.model)} placeholder="AR24" />
            {errors.model ? <p className="mt-2 text-sm text-destructive">{errors.model}</p> : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Purchase Date</span>
            <Input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} error={Boolean(errors.purchaseDate)} />
            {errors.purchaseDate ? <p className="mt-2 text-sm text-destructive">{errors.purchaseDate}</p> : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium text-foreground">Warranty Expiry</span>
            <Input type="date" value={warrantyExpiry} onChange={(event) => setWarrantyExpiry(event.target.value)} error={Boolean(errors.warrantyExpiry)} />
            {errors.warrantyExpiry ? <p className="mt-2 text-sm text-destructive">{errors.warrantyExpiry}</p> : null}
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">Photo upload</span>
            <Input type="file" accept="image/*" onChange={(event) => setPhotoFileName(event.target.files?.[0]?.name ?? "")} />
            <p className="mt-2 text-xs text-muted-foreground">Architecture ready. File metadata is captured now; storage integration can be added later.</p>
            {photoFileName ? <p className="mt-1 text-sm text-foreground">Selected: {photoFileName}</p> : null}
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-foreground">Invoice upload</span>
            <Input type="file" accept="application/pdf,image/*" onChange={(event) => setInvoiceFileName(event.target.files?.[0]?.name ?? "")} />
            <p className="mt-2 text-xs text-muted-foreground">Architecture ready. File metadata is captured now; storage integration can be added later.</p>
            {invoiceFileName ? <p className="mt-1 text-sm text-foreground">Selected: {invoiceFileName}</p> : null}
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (Object.keys(errors).length > 0) return;
              onSave(targetRoomId, {
                id: appliance?.id ?? crypto.randomUUID(),
                name,
                brand,
                model,
                purchaseDate,
                warrantyExpiry,
                photoFileName: photoFileName || undefined,
                invoiceFileName: invoiceFileName || undefined,
              });
              onOpenChange(false);
            }}
          >
            Save appliance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AppliancesStep() {
  const { draft, addAppliance, updateAppliance, deleteAppliance } = useOnboarding();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [targetRoomId, setTargetRoomId] = useState(draft.rooms[0]?.id ?? "");

  return (
    <OnboardingShell stepIndex={3} title="Appliances" description="Add appliances for each room with warranty-aware details.">
      <div className="space-y-5">
        <div className="text-sm text-muted-foreground">Examples: Air Conditioner, Refrigerator, Television, RO, Microwave, Washing Machine, Fan, Light, Laptop, Desktop, Printer</div>

        <div className="space-y-4">
          {draft.rooms.map((room) => (
            <Card key={room.id} className="border-border/60 bg-secondary/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{room.name}</div>
                  <div className="text-sm text-muted-foreground">{room.appliances.length} appliances</div>
                </div>
                <Button
                  className="h-10 gap-2"
                  onClick={() => {
                    setTargetRoomId(room.id);
                    setEditingAppliance(null);
                    setEditorOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Appliance
                </Button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {room.appliances.map((appliance) => (
                  <Card key={appliance.id} className="border-border/60 bg-background/90 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{appliance.name}</div>
                        <div className="text-sm text-muted-foreground">{appliance.brand} · {appliance.model}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => { setTargetRoomId(room.id); setEditingAppliance(appliance); setEditorOpen(true); }}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteAppliance(room.id, appliance.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">Purchase: {appliance.purchaseDate}</Badge>
                      <Badge variant="outline">Warranty: {appliance.warrantyExpiry}</Badge>
                    </div>
                  </Card>
                ))}
                {!room.appliances.length ? <div className="text-sm text-muted-foreground">No appliances added yet.</div> : null}
              </div>
            </Card>
          ))}
        </div>

        <StepActions backHref="/onboarding/rooms" backLabel="Back" nextHref="/onboarding/review" nextLabel="Review Setup" nextDisabled={draft.rooms.length === 0} />
      </div>

      <ApplianceEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        roomId={targetRoomId}
        rooms={draft.rooms}
        appliance={editingAppliance}
        onSave={(roomId, appliance) => {
          if (editingAppliance) {
            updateAppliance(roomId, editingAppliance.id, appliance);
          } else {
            addAppliance(roomId, appliance);
          }
        }}
      />
    </OnboardingShell>
  );
}

function ReviewStep() {
  const router = useRouter();
  const { draft } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. One onboarding source of truth
  const totalAppliances = useMemo(() => {
    return draft.rooms.reduce((count, room) => count + room.appliances.length, 0);
  }, [draft.rooms]);

  const payload = useMemo<OnboardingCompletePayload>(() => ({
    home: {
      homeName: (draft.homeName || "").trim(),
      homeType: draft.homeType as HomeType,
      address: (draft.address || "").trim(),
      city: (draft.city || "").trim(),
      state: (draft.state || "").trim(),
      pincode: (draft.pincode || "").trim(),
    },
    rooms: (draft.rooms || []).map((room) => ({
      name: (room.name || "").trim(),
      notes: (room.notes || "").trim() || undefined,
      appliances: (room.appliances || []).map((appliance) => ({
        name: (appliance.name || "").trim(),
        brand: (appliance.brand || "").trim(),
        model: (appliance.model || "").trim(),
        purchaseDate: appliance.purchaseDate,
        warrantyExpiry: appliance.warrantyExpiry,
        photoFileName: appliance.photoFileName,
        invoiceFileName: appliance.invoiceFileName,
      })),
    })),
  }), [draft]);

  // 6. Validation: Calculate completion dynamically from onboarding data
  const homeErrors = useMemo(() => validateHomeDraft(draft), [draft]);
  const isHomeValid = Object.keys(homeErrors).length === 0;
  const hasRooms = draft.rooms.length > 0;
  
  const invalidAppliances = useMemo(() => {
    return draft.rooms.flatMap(room => 
      room.appliances.filter(app => Object.keys(validateAppliance(app)).length > 0)
    );
  }, [draft.rooms]);
  const isAppliancesValid = invalidAppliances.length === 0;

  const missingItems = useMemo(() => {
    const items: string[] = [];
    if (!isHomeValid) {
      items.push("Home profile needs valid details (Home name, type, address, city, state, and 6-digit pincode)");
    }
    if (!hasRooms) {
      items.push("Onboarding requires at least one room configured");
    }
    if (!isAppliancesValid) {
      items.push("Ensure all added appliances have complete fields (brand, model, purchase date, warranty expiry)");
    }
    return items;
  }, [isHomeValid, hasRooms, isAppliancesValid]);

  const isOnboardingComplete = missingItems.length === 0;

  // 3. Home name: Never show "Untitled home" or "- / -". If no home exists show "No home created yet."
  const homeDisplayName = (draft.homeName && draft.homeName.trim()) 
    ? draft.homeName.trim() 
    : "No home created yet.";

  return (
    <OnboardingShell stepIndex={4} title="Review" description="Confirm the setup before we save it to Dwellix.">
      <div className="space-y-5">
        <Card className="border-border/60 bg-secondary/20 p-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Home</div>
              <div className="mt-1 text-lg font-semibold truncate">{homeDisplayName}</div>
              <div className="text-sm text-muted-foreground">
                {draft.homeType ? homeTypeLabel(draft.homeType as HomeType) : "No home created yet."}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rooms</div>
              <div className="mt-1 text-lg font-semibold">{draft.rooms.length}</div>
              <div className="text-sm text-muted-foreground">Defined spaces</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Appliances</div>
              <div className="mt-1 text-lg font-semibold">{totalAppliances}</div>
              <div className="text-sm text-muted-foreground">Tracked records</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</div>
              <div className="mt-1 text-lg font-semibold">
                {isOnboardingComplete ? "Ready to finish" : "Please complete setup"}
              </div>
              <div className="text-sm text-muted-foreground">
                {isOnboardingComplete ? "Validation passed" : "Pending required steps"}
              </div>
            </div>
          </div>
        </Card>

        {error ? <Card className="border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</Card> : null}

        {/* 2. Validation banner without contradictory states */}
        {!isOnboardingComplete ? (
          <Card className="border-destructive/20 bg-destructive/5 p-5 space-y-2.5">
            <div className="text-sm font-bold text-destructive">Please complete setup:</div>
            <ul className="list-disc list-inside text-xs text-destructive/95 space-y-1.5 font-medium">
              {missingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="border-emerald-500/20 bg-emerald-500/5 p-5 space-y-1">
            <div className="text-sm font-bold text-emerald-700">Ready to finish</div>
            <p className="text-xs text-emerald-600 font-medium">Validation passed. You can save your configurations and enter your dashboard.</p>
          </Card>
        )}

        <div className="space-y-4">
          <Card className="border-border/60 bg-background/90 p-5">
            <div className="text-sm font-semibold">Home</div>
            {(draft.address && draft.address.trim()) || (draft.city && draft.city.trim()) || (draft.state && draft.state.trim()) || (draft.pincode && draft.pincode.trim()) ? (
              <div className="mt-2 text-sm text-muted-foreground">
                {[draft.address, draft.city, draft.state].map(s => s?.trim()).filter(Boolean).join(", ")}
                {draft.pincode?.trim() ? ` - ${draft.pincode.trim()}` : ""}
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No home created yet.</div>
            )}
          </Card>

          {draft.rooms.map((room) => (
            <Card key={room.id} className="border-border/60 bg-background/90 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{room.name}</div>
                  <div className="text-sm text-muted-foreground">{room.notes || "No notes"}</div>
                </div>
                <Badge variant="outline">{room.appliances.length} appliances</Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
          Photo and invoice uploads are architecture-ready and currently capture metadata only until file storage is added.
        </div>

        {/* 7. Finish button enabled only when onboarding is complete */}
        <div className="space-y-2">
          {!isOnboardingComplete && (
            <p className="text-xs text-destructive font-semibold">
              * Finish button disabled. Please resolve the missing setup items listed above.
            </p>
          )}
          <StepActions
            backHref="/onboarding/appliances"
            backLabel="Back"
            nextLabel="Finish Setup"
            loading={loading}
            nextDisabled={!isOnboardingComplete}
            onNext={async () => {
              if (!isOnboardingComplete) return;
              setError(null);
              setLoading(true);
              try {
                await completeOnboarding(payload);
                clearOnboardingDraft();
                router.push("/dashboard");
              } catch (requestError) {
                setError(requestError instanceof OnboardingError ? requestError.message : "Unable to complete onboarding right now.");
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>
      </div>
    </OnboardingShell>
  );
}

export function OnboardingWizard({ step }: { step: "welcome" | "home" | "rooms" | "appliances" | "review" }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.25 }}
      >
        {step === "welcome" ? <WelcomeStep /> : null}
        {step === "home" ? <HomeStep /> : null}
        {step === "rooms" ? <RoomsStep /> : null}
        {step === "appliances" ? <AppliancesStep /> : null}
        {step === "review" ? <ReviewStep /> : null}
      </motion.div>
    </AnimatePresence>
  );
}

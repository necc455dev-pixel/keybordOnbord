package graph

import (
	"errors"
	"sort"
	"time"

	"keybordOnbord/backend/graph/model"
)

type KeyBoardRecord struct {
	Data      *model.KeyBoard
	CreatedAt time.Time
}

func (r *Resolver) ensureSeeded() {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.seeded {
		return
	}

	r.keyboards = map[string]*KeyBoardRecord{
		"kbd-001": {
			Data: &model.KeyBoard{
				ID:           "kbd-001",
				KeyCount:     61,
				IsSplit:      true,
				Maker:        "Keychron",
				HomePageLink: "https://www.keychron.com",
				Image:        nil,
			},
			CreatedAt: time.Date(2024, 7, 10, 12, 0, 0, 0, time.UTC),
		},
		"kbd-002": {
			Data: &model.KeyBoard{
				ID:           "kbd-002",
				KeyCount:     68,
				IsSplit:      false,
				Maker:        "HHKB",
				HomePageLink: "https://www.hhkeyboard.us",
				Image:        nil,
			},
			CreatedAt: time.Date(2024, 9, 18, 10, 30, 0, 0, time.UTC),
		},
		"kbd-003": {
			Data: &model.KeyBoard{
				ID:           "kbd-003",
				KeyCount:     75,
				IsSplit:      false,
				Maker:        "NuPhy",
				HomePageLink: "https://nuphy.com",
				Image:        nil,
			},
			CreatedAt: time.Date(2024, 11, 2, 8, 15, 0, 0, time.UTC),
		},
	}
	r.order = []string{"kbd-001", "kbd-002", "kbd-003"}
	r.seeded = true
}

func (r *Resolver) listKeyBoards() []*model.KeyBoard {
	r.ensureSeeded()

	r.mu.RLock()
	defer r.mu.RUnlock()

	results := make([]*model.KeyBoard, 0, len(r.order))
	for _, id := range r.order {
		rec, ok := r.keyboards[id]
		if !ok || rec == nil || rec.Data == nil {
			continue
		}
		results = append(results, cloneKeyBoard(rec.Data))
	}

	return results
}

func (r *Resolver) createKeyBoard(input model.NewKeyBoard) (*model.KeyBoard, error) {
	if input.ID == "" {
		return nil, errors.New("id is required")
	}
	if input.Maker == "" {
		return nil, errors.New("maker is required")
	}
	if input.HomePageLink == "" {
		return nil, errors.New("homePageLink is required")
	}

	r.ensureSeeded()

	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.keyboards[input.ID]; exists {
		return nil, errors.New("keyboard already exists")
	}

	created := &model.KeyBoard{
		ID:           input.ID,
		KeyCount:     input.KeyCount,
		IsSplit:      input.IsSplit,
		Maker:        input.Maker,
		HomePageLink: input.HomePageLink,
		Image:        input.Image,
	}

	r.keyboards[input.ID] = &KeyBoardRecord{
		Data:      created,
		CreatedAt: time.Now().UTC(),
	}
	r.order = append(r.order, input.ID)

	sort.Strings(r.order)

	return cloneKeyBoard(created), nil
}

func cloneKeyBoard(src *model.KeyBoard) *model.KeyBoard {
	if src == nil {
		return nil
	}
	dst := *src
	return &dst
}
